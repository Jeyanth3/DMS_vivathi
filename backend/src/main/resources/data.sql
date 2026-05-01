-- Seed Data for Debate Management System
-- Password for all users: password123 (BCrypt encoded)

INSERT INTO users (full_name, username, age, bio, location, email, password_hash, role, profile_picture_url, privacy_status, language, expertise, years_of_experience, created_at)
SELECT 'Alex Thompson', 'organizer1', 35, 'Seasoned debate organizer with 10+ years of experience running national tournaments.', 'Colombo, Sri Lanka', 'organizer1@dms.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EH0xP5u/1Ksg4YVPC.Ja.', 'ORGANIZER', NULL, 'PUBLIC', 'en', NULL, NULL, NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'organizer1');

INSERT INTO users (full_name, username, age, bio, location, email, password_hash, role, profile_picture_url, privacy_status, language, expertise, years_of_experience, created_at)
SELECT 'Priya Sharma', 'debater1', 21, 'Passionate debater specializing in Asian Parliamentary format. Won 3 regional tournaments.', 'Kandy, Sri Lanka', 'debater1@dms.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EH0xP5u/1Ksg4YVPC.Ja.', 'DEBATER', NULL, 'PUBLIC', 'en', NULL, NULL, NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'debater1');

INSERT INTO users (full_name, username, age, bio, location, email, password_hash, role, profile_picture_url, privacy_status, language, created_at)
SELECT 'Ravi Kumar', 'debater2', 19, 'First-year debater with a passion for environmental topics and policy debates.', 'Galle, Sri Lanka', 'debater2@dms.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EH0xP5u/1Ksg4YVPC.Ja.', 'DEBATER', NULL, 'PUBLIC', 'en', NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'debater2');

INSERT INTO users (full_name, username, age, bio, location, email, password_hash, role, profile_picture_url, privacy_status, language, created_at)
SELECT 'Aisha Mohamed', 'debater3', 22, 'Experienced debater with strong skills in British Parliamentary. National finalist 2023.', 'Jaffna, Sri Lanka', 'debater3@dms.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EH0xP5u/1Ksg4YVPC.Ja.', 'DEBATER', NULL, 'PUBLIC', 'en', NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'debater3');

INSERT INTO users (full_name, username, age, bio, location, email, password_hash, role, profile_picture_url, privacy_status, language, created_at)
SELECT 'Kasun Perera', 'debater4', 20, 'Young but talented debater from Peradeniya University. Specializes in Sinhala debates.', 'Peradeniya, Sri Lanka', 'debater4@dms.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EH0xP5u/1Ksg4YVPC.Ja.', 'DEBATER', NULL, 'PUBLIC', 'en', NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'debater4');

INSERT INTO users (full_name, username, age, bio, location, email, password_hash, role, profile_picture_url, privacy_status, language, expertise, years_of_experience, created_at)
SELECT 'Dr. Sarah Williams', 'judge1', 42, 'Former national debate champion. Certified judge for Asian Parliamentary and BP formats.', 'Colombo, Sri Lanka', 'judge1@dms.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EH0xP5u/1Ksg4YVPC.Ja.', 'JUDGE', NULL, 'PUBLIC', 'en', 'Asian Parliamentary, British Parliamentary', 15, NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'judge1');

INSERT INTO users (full_name, username, age, bio, location, email, password_hash, role, profile_picture_url, privacy_status, language, expertise, years_of_experience, created_at)
SELECT 'Prof. James Lee', 'judge2', 50, 'Professor of Communication Studies. Expert in rhetorical analysis and debate adjudication.', 'Colombo, Sri Lanka', 'judge2@dms.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EH0xP5u/1Ksg4YVPC.Ja.', 'JUDGE', NULL, 'PUBLIC', 'en', 'Traditional Debate, Asian Parliamentary', 20, NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'judge2');

-- Seed debater stats
INSERT INTO debater_stats (debater_id, matches_played, wins, losses, player_of_match_count, best_debater_tournament_count)
SELECT u.id, 15, 11, 4, 5, 2 FROM users u WHERE u.username = 'debater1'
AND NOT EXISTS (SELECT 1 FROM debater_stats ds JOIN users u2 ON ds.debater_id = u2.id WHERE u2.username = 'debater1');

INSERT INTO debater_stats (debater_id, matches_played, wins, losses, player_of_match_count, best_debater_tournament_count)
SELECT u.id, 8, 5, 3, 2, 1 FROM users u WHERE u.username = 'debater2'
AND NOT EXISTS (SELECT 1 FROM debater_stats ds JOIN users u2 ON ds.debater_id = u2.id WHERE u2.username = 'debater2');

INSERT INTO debater_stats (debater_id, matches_played, wins, losses, player_of_match_count, best_debater_tournament_count)
SELECT u.id, 20, 15, 5, 8, 3 FROM users u WHERE u.username = 'debater3'
AND NOT EXISTS (SELECT 1 FROM debater_stats ds JOIN users u2 ON ds.debater_id = u2.id WHERE u2.username = 'debater3');

INSERT INTO debater_stats (debater_id, matches_played, wins, losses, player_of_match_count, best_debater_tournament_count)
SELECT u.id, 12, 7, 5, 3, 1 FROM users u WHERE u.username = 'debater4'
AND NOT EXISTS (SELECT 1 FROM debater_stats ds JOIN users u2 ON ds.debater_id = u2.id WHERE u2.username = 'debater4');

-- Seed judge stats
INSERT INTO judge_stats (judge_id, matches_judged)
SELECT u.id, 45 FROM users u WHERE u.username = 'judge1'
AND NOT EXISTS (SELECT 1 FROM judge_stats js JOIN users u2 ON js.judge_id = u2.id WHERE u2.username = 'judge1');

INSERT INTO judge_stats (judge_id, matches_judged)
SELECT u.id, 62 FROM users u WHERE u.username = 'judge2'
AND NOT EXISTS (SELECT 1 FROM judge_stats js JOIN users u2 ON js.judge_id = u2.id WHERE u2.username = 'judge2');

-- Seed news posts
INSERT INTO news_posts (title, category, content, image_url, author_id, created_at)
SELECT
  'National Debate Championship 2024 Announced',
  'LATEST_NEWS',
  'The National Debate Championship 2024 has been officially announced. Registration opens next month for all universities across the country. This year''s championship will feature Asian Parliamentary and British Parliamentary formats.',
  'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800',
  (SELECT id FROM users WHERE username = 'organizer1' LIMIT 1),
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM news_posts WHERE title = 'National Debate Championship 2024 Announced');

INSERT INTO news_posts (title, category, content, image_url, author_id, created_at)
SELECT
  'Debate Techniques: Mastering the Art of Rebuttal',
  'VLOGS',
  'In this comprehensive guide, we explore advanced rebuttal techniques used by champion debaters. Learn how to effectively counter your opponent''s arguments while maintaining logical coherence.',
  'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800',
  (SELECT id FROM users WHERE username = 'organizer1' LIMIT 1),
  NOW() - INTERVAL '2 days'
WHERE NOT EXISTS (SELECT 1 FROM news_posts WHERE title = 'Debate Techniques: Mastering the Art of Rebuttal');

INSERT INTO news_posts (title, category, content, image_url, author_id, created_at)
SELECT
  'How Our Debate Club Changed My Life',
  'COMMUNITY_STORIES',
  'A heartfelt story from one of our members about how joining their university debate club transformed their confidence and communication skills. From shy freshman to national finalist in just two years.',
  'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800',
  (SELECT id FROM users WHERE username = 'debater3' LIMIT 1),
  NOW() - INTERVAL '5 days'
WHERE NOT EXISTS (SELECT 1 FROM news_posts WHERE title = 'How Our Debate Club Changed My Life');

-- Tamil author users for vlog content
INSERT INTO users (full_name, username, age, bio, location, email, password_hash, role, profile_picture_url, privacy_status, language, created_at)
SELECT 'Bhaveenthan Thankajanikanth', 'bhaveenthank', 22, 'Debate enthusiast and tournament organizer from Jaffna. Passionate about growing the debate community in Northern Sri Lanka.', 'Jaffna, Sri Lanka', 'e22051@eng.pdn.ac.lk', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EH0xP5u/1Ksg4YVPC.Ja.', 'ORGANIZER', NULL, 'PUBLIC', 'en', NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'bhaveenthank');

INSERT INTO users (full_name, username, age, bio, location, email, password_hash, role, profile_picture_url, privacy_status, language, created_at)
SELECT 'Karthikeyan Murugan', 'karthikeyan_m', 28, 'Senior debate coach and content creator covering competitive debate circuits across South Asia.', 'Colombo, Sri Lanka', 'karthikeyan@dms.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EH0xP5u/1Ksg4YVPC.Ja.', 'ORGANIZER', NULL, 'PUBLIC', 'en', NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'karthikeyan_m');

INSERT INTO users (full_name, username, age, bio, location, email, password_hash, role, profile_picture_url, privacy_status, language, created_at)
SELECT 'Priyanka Selvam', 'priyanka_s', 25, 'Debate analyst and former national champion. Creates video content about debate strategy and tournament formats.', 'Kandy, Sri Lanka', 'priyanka@dms.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EH0xP5u/1Ksg4YVPC.Ja.', 'ORGANIZER', NULL, 'PUBLIC', 'en', NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'priyanka_s');

INSERT INTO users (full_name, username, age, bio, location, email, password_hash, role, profile_picture_url, privacy_status, language, created_at)
SELECT 'Aarav Subramaniam', 'aarav_sub', 31, 'Debate researcher and vlogger. Documents the behind-the-scenes world of competitive debate tournaments.', 'Trincomalee, Sri Lanka', 'aarav@dms.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EH0xP5u/1Ksg4YVPC.Ja.', 'ORGANIZER', NULL, 'PUBLIC', 'en', NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'aarav_sub');

INSERT INTO users (full_name, username, age, bio, location, email, password_hash, role, profile_picture_url, privacy_status, language, created_at)
SELECT 'Meenakshi Ramasamy', 'meenakshi_r', 27, 'Tournament director and debate vlogger. Shares tips, tournament vlogs, and debate advice with her growing online audience.', 'Matara, Sri Lanka', 'meenakshi@dms.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EH0xP5u/1Ksg4YVPC.Ja.', 'ORGANIZER', NULL, 'PUBLIC', 'en', NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'meenakshi_r');

-- Vlogs (2026)
INSERT INTO news_posts (title, category, content, image_url, author_id, created_at)
SELECT
  'Vlog: My Week at the Asia Pacific Debate Championship 2026',
  'VLOGS',
  'I had the incredible opportunity to attend the Asia Pacific Debate Championship 2026 in Colombo, and I documented everything — from the opening ceremony to the nail-biting final round. Day 1 started with registration chaos and 400 debaters trying to find their rooms. By Day 2, the preliminary rounds were in full swing. I got to watch some of the most technically precise Asian Parliamentary rounds I have ever seen. The Sri Lanka team showed incredible composure in their round against Malaysia. Day 3 brought the octofinals, and the energy in the auditorium was electric. I interviewed three judges about what separates good speeches from great ones — their answers surprised me. By the final day, after watching Colombo beat Jakarta in a stunning final, I left with pages of notes, new friendships, and a renewed passion for debate. Watch the full vlog series on my profile.',
  'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800',
  (SELECT id FROM users WHERE username = 'bhaveenthank' LIMIT 1),
  TIMESTAMP '2026-01-20 10:00:00'
WHERE NOT EXISTS (SELECT 1 FROM news_posts WHERE title = 'Vlog: My Week at the Asia Pacific Debate Championship 2026');

INSERT INTO news_posts (title, category, content, image_url, author_id, created_at)
SELECT
  'How I Prepared for the National Debate Championships in 30 Days',
  'VLOGS',
  'Thirty days. That is all I had when I found out our team had qualified for the National Debate Championships. In this vlog, I take you through our entire preparation journey — the late-night research sessions, the practice rounds that went terribly wrong, the arguments we scrapped at midnight and rebuilt from scratch, and the moments of doubt that nearly made us quit. I break down the five motions we prepared most intensively and explain the research frameworks we used to build robust government and opposition cases. I also share the physical and mental health routines we followed during preparation week, because debate at the national level is as much about stamina as it is about argumentation. If you are preparing for a major tournament, this vlog is your blueprint.',
  'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800',
  (SELECT id FROM users WHERE username = 'karthikeyan_m' LIMIT 1),
  TIMESTAMP '2026-02-08 09:00:00'
WHERE NOT EXISTS (SELECT 1 FROM news_posts WHERE title = 'How I Prepared for the National Debate Championships in 30 Days');

INSERT INTO news_posts (title, category, content, image_url, author_id, created_at)
SELECT
  'Behind the Scenes: Organizing a 200-Team Debate Tournament',
  'VLOGS',
  'Most people only see the debate rounds. They do not see the 11 months of work that go into organizing a 200-team tournament. In this behind-the-scenes vlog, I document the full journey of organizing the Inter-University Debate Festival 2026 — from the first planning meeting in April 2025 to the closing ceremony this February. I cover venue negotiations, draw creation, judge briefings, the nightmare of last-minute team withdrawals, catering logistics, and the emotional rollercoaster of the final day. I also interview three first-time participants about their experience and discuss what we plan to improve next year. If you have ever thought about organizing a debate tournament, this is the honest, unfiltered truth of what it actually involves.',
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800',
  (SELECT id FROM users WHERE username = 'priyanka_s' LIMIT 1),
  TIMESTAMP '2026-02-25 14:30:00'
WHERE NOT EXISTS (SELECT 1 FROM news_posts WHERE title = 'Behind the Scenes: Organizing a 200-Team Debate Tournament');

INSERT INTO news_posts (title, category, content, image_url, author_id, created_at)
SELECT
  'Top 5 Mistakes Beginner Debaters Make (And How to Fix Them)',
  'VLOGS',
  'After judging over 300 rounds across five years, I have seen the same five mistakes come up again and again from beginner debaters. In this educational vlog, I break each one down with real examples from rounds I have judged, explain why these mistakes hurt your score, and give you actionable drills to fix them in under two weeks. Mistake number one — signposting too early and killing your own surprise. Mistake two — confusing assertion with argument. Mistake three — responding to what your opponent said rather than what they meant. Mistake four — abandoning your case structure under pressure. Mistake five — underestimating the importance of the reply speech. Each section includes a drill you can do in a 30-minute practice session. Share this with every new debater you know.',
  'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800',
  (SELECT id FROM users WHERE username = 'aarav_sub' LIMIT 1),
  TIMESTAMP '2026-03-12 11:00:00'
WHERE NOT EXISTS (SELECT 1 FROM news_posts WHERE title = 'Top 5 Mistakes Beginner Debaters Make (And How to Fix Them)');

INSERT INTO news_posts (title, category, content, image_url, author_id, created_at)
SELECT
  'A Day in the Life of a Competitive Debater During Tournament Season',
  'VLOGS',
  'Tournament season is nothing like people imagine. In this day-in-the-life vlog filmed during the Southern Regional Debate Circuit in March 2026, I show you what a typical tournament day actually looks like for a competitive debater. Wake up at 5:30am. Motion release at 6:00am. Fifteen minutes of preparation. Back-to-back rounds with forty-minute breaks in between. Oral adjudications that are simultaneously encouraging and crushing. Lunch eaten standing up while reviewing notes for the afternoon round. The emotional swing between a round you won convincingly and one where you lost to a split decision. The team debrief at 9pm. And finally, the moment results are announced. It is exhausting, exhilarating, and completely addictive.',
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800',
  (SELECT id FROM users WHERE username = 'meenakshi_r' LIMIT 1),
  TIMESTAMP '2026-03-28 16:00:00'
WHERE NOT EXISTS (SELECT 1 FROM news_posts WHERE title = 'A Day in the Life of a Competitive Debater During Tournament Season');
