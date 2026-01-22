// Основная логика сайта
document.addEventListener('DOMContentLoaded', function() {
    // Данные для проектов
    const projectsData = [
        {
            id: 1,
            title: "Парсер данных с BeautifulSoup",
            category: "python",
            description: "Парсинг сайтов для сбора структурированной информации. Использовал BeautifulSoup для анализа HTML и SQLite для хранения данных.",
            analogy: "Как цифровой архивариус, который автоматически собирает и систематизирует информацию из интернета.",
            code: `import requests
from bs4 import BeautifulSoup
import sqlite3
import time

def parse_website(url):
    """Основная функция парсинга"""
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Поиск нужных элементов
        articles = soup.find_all('article', class_='content-item')
        
        data = []
        for article in articles[:10]:  # Ограничиваем 10 элементами
            title = article.find('h2').text.strip() if article.find('h2') else 'Без названия'
            link = article.find('a')['href'] if article.find('a') else '#'
            
            # Сохранение в базу данных
            save_to_db(title, link)
            data.append({'title': title, 'link': link})
        
        return data
    except Exception as e:
        print(f"Ошибка при парсинге: {e}")
        return []

def save_to_db(title, link):
    """Сохранение данных в SQLite"""
    conn = sqlite3.connect('parsed_data.db')
    cursor = conn.cursor()
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS articles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            link TEXT NOT NULL,
            parsed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    cursor.execute('INSERT INTO articles (title, link) VALUES (?, ?)', (title, link))
    conn.commit()
    conn.close()

# Пример использования
if __name__ == "__main__":
    target_url = "https://example.com/news"
    parsed_data = parse_website(target_url)
    print(f"Спаршено {len(parsed_data)} статей")`,
            technologies: ["Python", "BeautifulSoup", "SQLite", "Requests"],
            links: {
                github: "https://github.com/mastefelix/web_scrapper",
                demo: null
            }
        },
        {
            id: 2,
            title: "Веб-приложение на Flask",
            category: "web",
            description: "Полнофункциональное веб-приложение для учета задач, развернутое на PythonAnywhere. Использует Flask, SQLAlchemy и Bootstrap.",
            analogy: "Как цифровой помощник, который всегда под рукой и помогает организовать рабочий процесс.",
            code: `from flask import Flask, render_template, request, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tasks.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Модель задачи
class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    status = db.Column(db.String(20), default='pending')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<Task {self.title}>'

@app.route('/')
def index():
    """Главная страница со списком задач"""
    tasks = Task.query.order_by(Task.created_at.desc()).all()
    return render_template('index.html', tasks=tasks)

@app.route('/task/add', methods=['POST'])
def add_task():
    """Добавление новой задачи"""
    title = request.form.get('title')
    description = request.form.get('description')
    
    if title:
        new_task = Task(title=title, description=description)
        db.session.add(new_task)
        db.session.commit()
    
    return redirect(url_for('index'))

@app.route('/task/<int:id>/complete')
def complete_task(id):
    """Отметка задачи как выполненной"""
    task = Task.query.get_or_404(id)
    task.status = 'completed'
    db.session.commit()
    return redirect(url_for('index'))

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)`,
            technologies: ["Python", "Flask", "SQLAlchemy", "HTML/CSS", "Bootstrap"],
            links: {
                github: "https://github.com/mastefelix/smart_solution",
                demo: "https://mastefelix.pythonanywhere.com"
            }
        },
        {
            id: 3,
            title: "ТЗ для приложения записи на курсы",
            category: "analytics",
            description: "Полный аналитический кейс: от сбора требований до проектирования архитектуры БД и создания диаграмм процессов в Draw.io.",
            analogy: "Как архитектор, который создает детальный план перед строительством дома.",
            code: `-- SQL-схема базы данных для приложения записи на курсы
CREATE TABLE users (
    id INT PRIMARY KEY AUTOINCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE courses (
    id INT PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2),
    duration_hours INT,
    instructor_id INT,
    max_students INT,
    start_date DATE,
    FOREIGN KEY (instructor_id) REFERENCES instructors(id)
);

CREATE TABLE enrollments (
    id INT PRIMARY KEY AUTOINCREMENT,
    user_id INT NOT NULL,
    course_id INT NOT NULL,
    enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'active',
    payment_status VARCHAR(20) DEFAULT 'pending',
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (course_id) REFERENCES courses(id),
    UNIQUE(user_id, course_id)
);

-- Пример сложного запроса: статистика по курсам
SELECT 
    c.title,
    COUNT(e.id) as enrolled_students,
    AVG(CASE WHEN e.payment_status = 'paid' THEN 1 ELSE 0 END) * 100 as payment_rate
FROM courses c
LEFT JOIN enrollments e ON c.id = e.course_id
GROUP BY c.id
ORDER BY enrolled_students DESC;`,
            technologies: ["Draw.io", "SQL", "Анализ требований", "BPMN"],
            links: {
                github: null,
                demo: "#"
            }
        },
        {
            id: 4,
            title: "Игра на PyGame",
            category: "python",
            description: "Интерактивная игра с использованием библиотеки PyGame. Демонстрирует навыки работы с графикой, анимацией и обработкой событий.",
            analogy: "Как конструктор, который оживляет идеи с помощью кода и анимации.",
            code: `import pygame
import sys
import random

# Инициализация PyGame
pygame.init()

# Настройки экрана
WIDTH, HEIGHT = 800, 600
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Моя игра на PyGame")

# Цвета
BACKGROUND = (20, 30, 50)
PLAYER_COLOR = (0, 200, 100)
ENEMY_COLOR = (220, 60, 60)

class Player:
    def __init__(self):
        self.x = WIDTH // 2
        self.y = HEIGHT - 50
        self.width = 50
        self.height = 30
        self.speed = 5
        self.score = 0
    
    def draw(self):
        pygame.draw.rect(screen, PLAYER_COLOR, 
                        (self.x, self.y, self.width, self.height))
    
    def move(self, direction):
        if direction == "left" and self.x > 0:
            self.x -= self.speed
        if direction == "right" and self.x < WIDTH - self.width:
            self.x += self.speed

class Game:
    def __init__(self):
        self.player = Player()
        self.enemies = []
        self.clock = pygame.time.Clock()
        self.running = True
        self.font = pygame.font.Font(None, 36)
    
    def run(self):
        while self.running:
            self.handle_events()
            self.update()
            self.draw()
            self.clock.tick(60)
        
        pygame.quit()
        sys.exit()
    
    def handle_events(self):
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                self.running = False
        
        keys = pygame.key.get_pressed()
        if keys[pygame.K_LEFT]:
            self.player.move("left")
        if keys[pygame.K_RIGHT]:
            self.player.move("right")
    
    def update(self):
        # Логика игры здесь
        pass
    
    def draw(self):
        screen.fill(BACKGROUND)
        self.player.draw()
        
        # Отрисовка счета
        score_text = self.font.render(f"Счет: {self.player.score}", True, (255, 255, 255))
        screen.blit(score_text, (10, 10))
        
        pygame.display.flip()

if __name__ == "__main__":
    game = Game()
    game.run()`,
            technologies: ["Python", "PyGame", "ООП"],
            links: {
                github: "https://github.com/mastefelix/pygame",
                demo: null
            }
        }
    ];

    // Данные для облака навыков
    const skillsData = [
        { name: "Python", level: 90, x: 50, y: 50 },
        { name: "Flask", level: 75, x: 20, y: 30 },
        { name: "Pandas", level: 70, x: 70, y: 40 },
        { name: "NumPy", level: 65, x: 80, y: 60 },
        { name: "SQL", level: 80, x: 40, y: 70 },
        { name: "HTML/CSS", level: 85, x: 60, y: 20 },
        { name: "JavaScript", level: 70, x: 30, y: 80 },
        { name: "Git", level: 85, x: 70, y: 80 },
        { name: "BeautifulSoup", level: 75, x: 20, y: 60 },
        { name: "PyGame", level: 60, x: 80, y: 30 },
        { name: "Figma", level: 70, x: 40, y: 40 },
        { name: "Draw.io", level: 85, x: 60, y: 60 },
        { name: "1C", level: 60, x: 30, y: 50 }
    ];

    // Инициализация
    initNavigation();
    initTextAnimation();
    initProjects(projectsData);
    initSkillsCloud(skillsData);
    initModal();
    initContactForm();
    initFilterButtons();

    // Функция для инициализации навигации
    function initNavigation() {
        const menuToggle = document.querySelector('.menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
        
        // Закрытие меню при клике на ссылку
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
        
        // Плавная прокрутка
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 70,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Анимация смены текста
    function initTextAnimation() {
        const textElement = document.getElementById('changing-text');
        const texts = [
            "сложные задачи",
            "большие данные",
            "нейросети",
            "бизнес-процессы",
            "алгоритмы"
        ];
        
        let currentIndex = 0;
        
        function changeText() {
            textElement.style.opacity = 0;
            
            setTimeout(() => {
                currentIndex = (currentIndex + 1) % texts.length;
                textElement.textContent = texts[currentIndex];
                textElement.style.opacity = 1;
            }, 500);
        }
        
        // Меняем текст каждые 3 секунды
        setInterval(changeText, 3000);
    }

    // Инициализация проектов
    function initProjects(projects) {
        const grid = document.getElementById('projects-grid');
        
        projects.forEach(project => {
            const projectCard = createProjectCard(project);
            grid.appendChild(projectCard);
        });
        
        // Подсветка синтаксиса
        hljs.highlightAll();
    }

    // Создание карточки проекта
    function createProjectCard(project) {
        const card = document.createElement('div');
        card.className = `project-card ${project.category}`;
        card.dataset.category = project.category;
        
        const iconMap = {
            python: '<i class="fab fa-python"></i>',
            web: '<i class="fas fa-globe"></i>',
            analytics: '<i class="fas fa-chart-line"></i>'
        };
        
        card.innerHTML = `
            <div class="project-image" style="background-color: ${getCategoryColor(project.category)}">
                ${iconMap[project.category] || '<i class="fas fa-code"></i>'}
            </div>
            <div class="project-content">
                <h3 class="project-title">${project.title}</h3>
                <span class="project-category">${getCategoryName(project.category)}</span>
                <p class="project-description">${project.description}</p>
                <div class="project-tech">
                    ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
                <div class="project-links">
                    ${project.links.github ? `<a href="${project.links.github}" target="_blank" class="btn btn-secondary">GitHub</a>` : ''}
                    ${project.links.demo ? `<a href="${project.links.demo}" target="_blank" class="btn btn-primary">Демо</a>` : ''}
                    <button class="btn btn-secondary view-details" data-project-id="${project.id}">Подробнее</button>
                </div>
            </div>
        `;
        
        // Добавляем обработчик для кнопки "Подробнее"
        card.querySelector('.view-details').addEventListener('click', () => {
            openProjectModal(project);
        });
        
        return card;
    }

    // Фильтрация проектов
    function initFilterButtons() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Обновляем активную кнопку
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                const filter = button.dataset.filter;
                
                // Фильтруем проекты
                projectCards.forEach(card => {
                    if (filter === 'all' || card.dataset.category === filter) {
                        card.style.display = 'flex';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 10);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    // Облако навыков
    function initSkillsCloud(skills) {
        const cloud = document.getElementById('skills-cloud');
        
        skills.forEach(skill => {
            const tag = document.createElement('div');
            tag.className = 'cloud-tag';
            tag.textContent = skill.name;
            tag.style.left = `${skill.x}%`;
            tag.style.top = `${skill.y}%`;
            tag.style.fontSize = `${0.8 + skill.level / 100}rem`;
            tag.style.opacity = `${0.7 + skill.level / 200}`;
            
            cloud.appendChild(tag);
        });
    }

    // Модальное окно
    function initModal() {
        const modal = document.getElementById('project-modal');
        const closeBtn = document.querySelector('.modal-close');
        
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
        
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    // Открытие модального окна с проектом
    function openProjectModal(project) {
        const modal = document.getElementById('project-modal');
        const modalBody = document.getElementById('modal-body');
        
        modalBody.innerHTML = `
            <h2>${project.title}</h2>
            <p><strong>Аналогия:</strong> ${project.analogy}</p>
            <p>${project.description}</p>
            
            <div class="project-tech" style="margin: 1.5rem 0;">
                ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
            </div>
            
            <h3>Ключевой фрагмент кода:</h3>
            <pre class="modal-code"><code class="language-python">${project.code}</code></pre>
            
            <div class="project-links">
                ${project.links.github ? `<a href="${project.links.github}" target="_blank" class="btn btn-primary">GitHub</a>` : ''}
                ${project.links.demo ? `<a href="${project.links.demo}" target="_blank" class="btn btn-secondary">Живое демо</a>` : ''}
            </div>
        `;
        
        modal.style.display = 'block';
        hljs.highlightAll();
    }

    // Форма обратной связи
    function initContactForm() {
        const form = document.getElementById('contact-form');
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value
            };
            
            // Здесь можно добавить отправку на сервер
            // Для примера просто показываем alert
            alert(`Спасибо, ${formData.name}! Ваше сообщение отправлено. Я свяжусь с вами в ближайшее время.`);
            form.reset();
        });
    }

    // Вспомогательные функции
    function getCategoryColor(category) {
        const colors = {
            python: '#306998',
            web: '#e44d26',
            analytics: '#10b981'
        };
        return colors[category] || '#64748b';
    }

    function getCategoryName(category) {
        const names = {
            python: 'Python',
            web: 'Веб-разработка',
            analytics: 'Аналитика'
        };
        return names[category] || 'Проект';
    }

    // Параллакс-эффект для hero-секции
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        hero.style.backgroundPositionY = `${scrolled * 0.5}px`;
    });
});