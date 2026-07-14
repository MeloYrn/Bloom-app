package com.bloom.community_service.controller;

import com.bloom.community_service.dto.PostRequest;
import com.bloom.community_service.model.CommunityPost;
import com.bloom.community_service.repository.PostRepository;
import com.bloom.community_service.service.ModerationService;
import com.bloom.community_service.service.PseudonymService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/community")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class CommunityController {

    private final PostRepository postRepo;
    private final PseudonymService pseudonymService;
    private final ModerationService moderationService;
    private final SimpMessagingTemplate messagingTemplate;

    // Get posts for a channel, e.g. GET /api/community/posts/general
    @GetMapping("/posts/{channel}")
    public ResponseEntity<List<CommunityPost>> getPosts(@PathVariable String channel) {
        return ResponseEntity.ok(postRepo.findByChannelOrderByCreatedAtDesc(channel));
    }

    // Create a new anonymous post
    @PostMapping("/posts")
    public ResponseEntity<CommunityPost> createPost(@RequestBody PostRequest req) {
        CommunityPost post = new CommunityPost();
        post.setPseudonym(pseudonymService.generate());
        post.setChannel(req.getChannel());
        post.setContent(req.getContent());
        post.setIsFlagged(moderationService.shouldFlag(req.getContent()));

        CommunityPost saved = postRepo.save(post);

        // Broadcast to everyone subscribed to this channel in real time
        messagingTemplate.convertAndSend("/topic/channel/" + req.getChannel(), saved);

        return ResponseEntity.ok(saved);
    }

    // Upvote a post
    @PostMapping("/posts/{id}/upvote")
    public ResponseEntity<Void> upvote(@PathVariable UUID id) {
        postRepo.findById(id).ifPresent(post -> {
            post.setUpvotes(post.getUpvotes() + 1);
            postRepo.save(post);
        });
        return ResponseEntity.ok().build();
    }

    // Report/flag a post for moderator review
    @PostMapping("/posts/{id}/flag")
    public ResponseEntity<Void> flag(@PathVariable UUID id) {
        postRepo.findById(id).ifPresent(post -> {
            post.setIsFlagged(true);
            postRepo.save(post);
        });
        return ResponseEntity.ok().build();
    }

    // Moderator view - list all flagged posts across channels
    @GetMapping("/posts/flagged")
    public ResponseEntity<List<CommunityPost>> getFlagged() {
        return ResponseEntity.ok(postRepo.findByIsFlaggedTrue());
    }
}
