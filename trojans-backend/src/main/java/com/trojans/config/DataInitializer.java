package com.trojans.config;

import com.trojans.model.News;
import com.trojans.model.Player;
import com.trojans.model.User;
import com.trojans.repository.NewsRepository;
import com.trojans.repository.PlayerRepository;
import com.trojans.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {
    
    private final UserRepository userRepository;
    private final PlayerRepository playerRepository;
    private final NewsRepository newsRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) {
        // Create default admin if not exists
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setEmail("admin@trojans.co.ke");
            admin.setRole("ADMIN");
            userRepository.save(admin);
            log.info("Default admin user created: admin / admin123");
        }
        
        // Seed initial players if empty
        if (playerRepository.count() == 0) {
            List<Player> players = List.of(
                createPlayer("Andre Obure", "Prop", "1", "forwards"),
                createPlayer("Steve Odongo", "Hooker", "2", "forwards"),
                createPlayer("Anyega Newton", "Prop", "3", "forwards"),
                createPlayer("Waraba Isaac", "Lock", "4", "forwards"),
                createPlayer("Bradley Thomas", "Lock", "5", "forwards"),
                createPlayer("Dennis Otieno", "Flanker", "6", "forwards"),
                createPlayer("Simon Koigi", "Flanker", "7", "forwards"),
                createPlayer("Peter Mwendwa", "Wing", "11", "backs"),
                createPlayer("Hanish Ochieng", "Flanker", "7", "forwards"),
                createPlayer("Cornelius Kiptum", "Centre", "12", "backs"),
                createPlayer("Clifford Mukuria", "Wing", "11", "backs"),
                createPlayer("Mark Ngugi", "Prop", "1", "forwards"),
                createPlayer("Elvis Obiero", "Centre", "13", "backs"),
                createPlayer("Patrick Apiri", "Centre", "12", "backs"),
                createPlayer("Brian Selete", "Full-Back", "15", "backs"),
                createPlayer("Kelvin Xavier", "Head Coach", "", "staff"),
                createPlayer("Reagan Kamau", "Manager", "", "staff"),
                createPlayer("Worship", "Physio", "", "staff"),
                createPlayer("Jeremy Ogutu", "Scrum-Half", "9", "backs"),
                createPlayer("Brian Ireri", "Wing", "14", "backs"),
                createPlayer("James Waithaka", "Scrum-Half", "9", "backs"),
                createPlayer("Sam Nyanga", "Fly-Half", "10", "backs")
            );
            playerRepository.saveAll(players);
            log.info("Seeded {} players", players.size());
        }
        
        // Seed initial news if empty
        if (newsRepository.count() == 0) {
            List<News> news = List.of(
                createNews("Trojans Win BingwaFest Kenya Championship!", 
                    "Historic victory at BingwaFest Kenya with 250,000 KES prize money! Our team showed exceptional skill and determination throughout the tournament.",
                    "21. DECEMBER 2025"),
                createNews("Celebrations of Tears and Joy from Trojans Captain Sam",
                    "From the final whistle to the celebrations that followed, captain Sam's tears of joy captured the passion, sacrifice, and unity of the Trojans.",
                    "21. DECEMBER 2025"),
                createNews("BingwaFest Kenya - Road to Finals",
                    "Relive our incredible journey through the BingwaFest Kenya tournament. From group stages to the grand finale!",
                    "21. DECEMBER 2025"),
                createNews("Youth Academy Opens Enrollment",
                    "Join our youth development program and train with the best coaches in Central Kenya. Ages 8-18 welcome!",
                    "10. DECEMBER 2024")
            );
            newsRepository.saveAll(news);
            log.info("Seeded {} news items", news.size());
        }
        
        log.info("Application initialized with sample data");
    }
    
    private Player createPlayer(String name, String position, String number, String category) {
        Player player = new Player();
        player.setName(name);
        player.setPosition(position);
        player.setJerseyNumber(number);
        player.setCategory(category);
        player.setImageUrl("https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=400&q=80");
        return player;
    }
    
    private News createNews(String title, String description, String date) {
        News news = new News();
        news.setTitle(title);
        news.setDescription(description);
        news.setDate(date);
        news.setImageUrl("https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=600&q=80");
        return news;
    }
}