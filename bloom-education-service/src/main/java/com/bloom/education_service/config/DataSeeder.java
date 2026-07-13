package com.bloom.education_service.config;

import com.bloom.education_service.model.Article;
import com.bloom.education_service.repository.ArticleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final ArticleRepository articleRepository;

    @Override
    public void run(String... args) {
        if (articleRepository.count() > 0) {
            return; // already seeded
        }

        seed("Understanding Your Menstrual Cycle", "Menstrual Health",
            "A beginner-friendly overview of the four phases of the cycle.",
            "Your menstrual cycle has four phases: menstrual, follicular, ovulatory, "
            + "and luteal. Each phase is driven by shifting hormone levels and can "
            + "affect your energy, mood, and physical symptoms differently. Tracking "
            + "these phases over a few months helps you recognise your own normal "
            + "pattern, making it easier to spot anything unusual and to plan around "
            + "your body's natural rhythm.",
            "Bloom Health Team");

        seed("Cramps: What's Normal and What Isn't", "Menstrual Health",
            "How to tell everyday period pain from something that needs attention.",
            "Mild to moderate cramping in the first day or two of your period is "
            + "common and caused by the uterus contracting. Warmth, gentle movement, "
            + "hydration, and over-the-counter pain relief (if suitable for you) can "
            + "help. Pain that stops you from going about your day, lasts well beyond "
            + "your period, or is getting worse over time is worth discussing with a "
            + "healthcare provider rather than managing alone.",
            "Bloom Health Team");

        seed("Discharge 101: A Quick Reference", "Discharge Guide",
            "A short companion guide to the in-app discharge assessment tool.",
            "Normal discharge is typically clear to white, without a strong odour, "
            + "and changes in amount and texture across your cycle. Yellow or green "
            + "colour, a strong or fishy odour, unusual texture, or accompanying "
            + "itching or discomfort can be signs worth getting checked by a doctor. "
            + "This guide is educational only \u2014 the in-app assessment tool can help "
            + "you log and understand your own patterns in more detail.",
            "Bloom Health Team");

        seed("Eating for Your Cycle", "Nutrition",
            "Simple nutrition tips that support energy and mood across your cycle.",
            "Iron-rich foods like beans, leafy greens, and lean meats can help "
            + "replace what's lost during your period. Complex carbohydrates and "
            + "magnesium-rich foods (nuts, whole grains, dark chocolate) may help "
            + "ease mood dips and cramping in the days before your period. Staying "
            + "hydrated also helps reduce bloating and headaches for many people.",
            "Bloom Health Team");

        seed("Talking About Periods Without Shame", "Reproductive Wellness",
            "Why open conversation about menstrual health matters.",
            "Menstrual health stigma leads real harm \u2014 missed school days, delayed "
            + "diagnoses, and unnecessary isolation. Normal bodily functions don't "
            + "need to be hidden. Bloom's anonymous community exists so you can ask "
            + "questions and share experiences without fear of judgment, while this "
            + "library gives you a reliable starting point for accurate information.",
            "Bloom Health Team");
    }

    private void seed(String title, String category, String summary, String content, String author) {
        Article article = new Article();
        article.setTitle(title);
        article.setCategory(category);
        article.setSummary(summary);
        article.setContent(content);
        article.setAuthor(author);
        articleRepository.save(article);
    }
}
