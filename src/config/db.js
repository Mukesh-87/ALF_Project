const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../../database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        // Initialize schema automatically
        db.serialize(() => {
            db.run(`CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`);
            
            db.run(`CREATE TABLE IF NOT EXISTS learner_profiles (
                user_id INTEGER PRIMARY KEY,
                current_difficulty_level TEXT DEFAULT 'Easy',
                overall_score REAL DEFAULT 0.0,
                FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
            )`);
            
            db.run(`CREATE TABLE IF NOT EXISTS content_blocks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                difficulty_level TEXT NOT NULL,
                question_text TEXT NOT NULL,
                options TEXT NOT NULL,
                correct_answer TEXT NOT NULL
            )`);
            
            db.run(`CREATE TABLE IF NOT EXISTS performance_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                content_block_id INTEGER,
                score REAL NOT NULL,
                time_taken_seconds INTEGER NOT NULL,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY(content_block_id) REFERENCES content_blocks(id) ON DELETE CASCADE
            )`);

            // Insert 200 high-quality, diverse questions
            const questions = [
                // --- EASY (70 questions, IDs 1-70) ---
                { id: 1, level: 'Easy', text: 'What is 2 + 2?', options: ['3', '4', '5', '6'], answer: '4' },
                { id: 2, level: 'Easy', text: 'What color is the sky on a clear day?', options: ['Green', 'Red', 'Blue', 'Yellow'], answer: 'Blue' },
                { id: 3, level: 'Easy', text: 'How many days are there in a week?', options: ['5', '6', '7', '8'], answer: '7' },
                { id: 4, level: 'Easy', text: 'Which animal is known as the King of the Jungle?', options: ['Tiger', 'Elephant', 'Lion', 'Giraffe'], answer: 'Lion' },
                { id: 5, level: 'Easy', text: 'What is the opposite of hot?', options: ['Warm', 'Cold', 'Wet', 'Dry'], answer: 'Cold' },
                { id: 6, level: 'Easy', text: 'Which fruit is red and typically crunchy?', options: ['Banana', 'Apple', 'Orange', 'Grape'], answer: 'Apple' },
                { id: 7, level: 'Easy', text: 'How many legs does a spider have?', options: ['6', '8', '10', '12'], answer: '8' },
                { id: 8, level: 'Easy', text: 'What is the standard color of a banana when ripe?', options: ['Red', 'Green', 'Blue', 'Yellow'], answer: 'Yellow' },
                { id: 9, level: 'Easy', text: 'What is 10 - 3?', options: ['5', '6', '7', '8'], answer: '7' },
                { id: 10, level: 'Easy', text: 'Which celestial body shines during the day?', options: ['Moon', 'Sun', 'Mars', 'Jupiter'], answer: 'Sun' },
                { id: 11, level: 'Easy', text: 'What is the capital of India?', options: ['Mumbai', 'Kolkata', 'New Delhi', 'Chennai'], answer: 'New Delhi' },
                { id: 12, level: 'Easy', text: 'How many letters are there in the English alphabet?', options: ['24', '25', '26', '27'], answer: '26' },
                { id: 13, level: 'Easy', text: 'Which shape has three sides?', options: ['Square', 'Triangle', 'Circle', 'Rectangle'], answer: 'Triangle' },
                { id: 14, level: 'Easy', text: 'What do bees make?', options: ['Milk', 'Honey', 'Water', 'Juice'], answer: 'Honey' },
                { id: 15, level: 'Easy', text: 'Which season comes after winter?', options: ['Summer', 'Autumn', 'Spring', 'Monsoon'], answer: 'Spring' },
                { id: 16, level: 'Easy', text: 'What is 5 x 2?', options: ['8', '9', '10', '12'], answer: '10' },
                { id: 17, level: 'Easy', text: 'Which organ is used to breathe?', options: ['Heart', 'Lungs', 'Stomach', 'Brain'], answer: 'Lungs' },
                { id: 18, level: 'Easy', text: 'What is the opposite of "Happy"?', options: ['Glad', 'Sad', 'Angry', 'Excited'], answer: 'Sad' },
                { id: 19, level: 'Easy', text: 'How many fingers do humans typically have on one hand?', options: ['4', '5', '6', '10'], answer: '5' },
                { id: 20, level: 'Easy', text: 'What is the capital of the USA?', options: ['New York', 'Los Angeles', 'Washington D.C.', 'Chicago'], answer: 'Washington D.C.' },
                { id: 21, level: 'Easy', text: 'Which animal says "Meow"?', options: ['Dog', 'Cat', 'Cow', 'Lion'], answer: 'Cat' },
                { id: 22, level: 'Easy', text: 'What do we use to cut paper?', options: ['Glue', 'Scissors', 'Pencil', 'Eraser'], answer: 'Scissors' },
                { id: 23, level: 'Easy', text: 'What is the name of our planet?', options: ['Mars', 'Venus', 'Earth', 'Jupiter'], answer: 'Earth' },
                { id: 24, level: 'Easy', text: 'What is 20 + 5?', options: ['22', '24', '25', '26'], answer: '25' },
                { id: 25, level: 'Easy', text: 'Which of these is a vegetable?', options: ['Apple', 'Carrot', 'Banana', 'Orange'], answer: 'Carrot' },
                { id: 26, level: 'Easy', text: 'What color are grass and leaves?', options: ['Blue', 'Green', 'Yellow', 'Red'], answer: 'Green' },
                { id: 27, level: 'Easy', text: 'Which animal is known for its long neck?', options: ['Elephant', 'Lion', 'Giraffe', 'Hippo'], answer: 'Giraffe' },
                { id: 28, level: 'Easy', text: 'How many months are there in a year?', options: ['10', '11', '12', '13'], answer: '12' },
                { id: 29, level: 'Easy', text: 'What is the opposite of "Big"?', options: ['Large', 'Huge', 'Small', 'Tall'], answer: 'Small' },
                { id: 30, level: 'Easy', text: 'Which of these is a primary color?', options: ['Green', 'Orange', 'Red', 'Purple'], answer: 'Red' },
                { id: 31, level: 'Easy', text: 'How many wheels does a standard bicycle have?', options: ['1', '2', '3', '4'], answer: '2' },
                { id: 32, level: 'Easy', text: 'What is 12 - 4?', options: ['6', '7', '8', '9'], answer: '8' },
                { id: 33, level: 'Easy', text: 'What do you wear on your head?', options: ['Shoes', 'Socks', 'Cap', 'Gloves'], answer: 'Cap' },
                { id: 34, level: 'Easy', text: 'Which animal is known for swimming in water?', options: ['Fish', 'Bird', 'Monkey', 'Rabbit'], answer: 'Fish' },
                { id: 35, level: 'Easy', text: 'What do trees produce that we breathe?', options: ['Nitrogen', 'Oxygen', 'Carbon Dioxide', 'Helium'], answer: 'Oxygen' },
                { id: 36, level: 'Easy', text: 'What is 3 x 3?', options: ['6', '8', '9', '12'], answer: '9' },
                { id: 37, level: 'Easy', text: 'What do you use to write on a blackboard?', options: ['Pen', 'Pencil', 'Chalk', 'Marker'], answer: 'Chalk' },
                { id: 38, level: 'Easy', text: 'Which is the largest bird in the world?', options: ['Eagle', 'Penguin', 'Ostrich', 'Peacock'], answer: 'Ostrich' },
                { id: 39, level: 'Easy', text: 'What is the standard color of snow?', options: ['White', 'Blue', 'Grey', 'Silver'], answer: 'White' },
                { id: 40, level: 'Easy', text: 'What is 10 + 10?', options: ['15', '18', '20', '22'], answer: '20' },
                { id: 41, level: 'Easy', text: 'Which of these animals can fly?', options: ['Dog', 'Cat', 'Sparrow', 'Frog'], answer: 'Sparrow' },
                { id: 42, level: 'Easy', text: 'What is the opposite of "Fast"?', options: ['Quick', 'Slow', 'Rapid', 'Heavy'], answer: 'Slow' },
                { id: 43, level: 'Easy', text: 'How many players are on a standard soccer team on the field?', options: ['9', '10', '11', '12'], answer: '11' },
                { id: 44, level: 'Easy', text: 'Which organ pumps blood in the human body?', options: ['Lungs', 'Stomach', 'Heart', 'Kidney'], answer: 'Heart' },
                { id: 45, level: 'Easy', text: 'What color is a ripe strawberry?', options: ['Red', 'Green', 'Yellow', 'Blue'], answer: 'Red' },
                { id: 46, level: 'Easy', text: 'What is 15 - 5?', options: ['8', '9', '10', '12'], answer: '10' },
                { id: 47, level: 'Easy', text: 'Which day comes after Friday?', options: ['Sunday', 'Saturday', 'Monday', 'Thursday'], answer: 'Saturday' },
                { id: 48, level: 'Easy', text: 'What do we use to hear sounds?', options: ['Eyes', 'Ears', 'Nose', 'Mouth'], answer: 'Ears' },
                { id: 49, level: 'Easy', text: 'What is the name of a baby dog?', options: ['Kitten', 'Cub', 'Puppy', 'Calf'], answer: 'Puppy' },
                { id: 50, level: 'Easy', text: 'Which season is the coldest?', options: ['Summer', 'Winter', 'Spring', 'Autumn'], answer: 'Winter' },
                { id: 51, level: 'Easy', text: 'What is 4 x 2?', options: ['6', '8', '10', '12'], answer: '8' },
                { id: 52, level: 'Easy', text: 'Which celestial body orbits the Earth?', options: ['Sun', 'Moon', 'Mars', 'Venus'], answer: 'Moon' },
                { id: 53, level: 'Easy', text: 'What do you use to clean your teeth?', options: ['Soap', 'Shampoo', 'Toothbrush', 'Comb'], answer: 'Toothbrush' },
                { id: 54, level: 'Easy', text: 'How many corners does a square have?', options: ['3', '4', '5', '6'], answer: '4' },
                { id: 55, level: 'Easy', text: 'What is 30 + 10?', options: ['35', '38', '40', '42'], answer: '40' },
                { id: 56, level: 'Easy', text: 'What is the opposite of "Soft"?', options: ['Hard', 'Smooth', 'Fluffy', 'Gentle'], answer: 'Hard' },
                { id: 57, level: 'Easy', text: 'Which insect makes cobwebs?', options: ['Bee', 'Ant', 'Spider', 'Fly'], answer: 'Spider' },
                { id: 58, level: 'Easy', text: 'What is the liquid inside a coconut?', options: ['Milk', 'Water', 'Juice', 'Soda'], answer: 'Water' },
                { id: 59, level: 'Easy', text: 'What do we use our nose for?', options: ['Tasting', 'Seeing', 'Smelling', 'Hearing'], answer: 'Smelling' },
                { id: 60, level: 'Easy', text: 'What is 9 - 4?', options: ['4', '5', '6', '7'], answer: '5' },
                { id: 61, level: 'Easy', text: 'Which of these is a sweet substance?', options: ['Salt', 'Pepper', 'Sugar', 'Vinegar'], answer: 'Sugar' },
                { id: 62, level: 'Easy', text: 'Which animal has a trunk?', options: ['Lion', 'Elephant', 'Tiger', 'Giraffe'], answer: 'Elephant' },
                { id: 63, level: 'Easy', text: 'What color is a lemon?', options: ['Red', 'Green', 'Yellow', 'Orange'], answer: 'Yellow' },
                { id: 64, level: 'Easy', text: 'What is 8 x 1?', options: ['1', '7', '8', '9'], answer: '8' },
                { id: 65, level: 'Easy', text: 'How many sides does a rectangle have?', options: ['3', '4', '5', '6'], answer: '4' },
                { id: 66, level: 'Easy', text: 'What do birds lay to have babies?', options: ['Seeds', 'Eggs', 'Milk', 'Flowers'], answer: 'Eggs' },
                { id: 67, level: 'Easy', text: 'What is the opposite of "Up"?', options: ['Down', 'Left', 'Right', 'High'], answer: 'Down' },
                { id: 68, level: 'Easy', text: 'Which of these is a transportation on water?', options: ['Car', 'Train', 'Ship', 'Bicycle'], answer: 'Ship' },
                { id: 69, level: 'Easy', text: 'What is 5 + 5?', options: ['8', '9', '10', '11'], answer: '10' },
                { id: 70, level: 'Easy', text: 'Which shape is perfectly round?', options: ['Square', 'Triangle', 'Circle', 'Oval'], answer: 'Circle' },

                // --- MEDIUM (70 questions, IDs 71-140) ---
                { id: 71, level: 'Medium', text: 'What is the capital of France?', options: ['London', 'Berlin', 'Madrid', 'Paris'], answer: 'Paris' },
                { id: 72, level: 'Medium', text: 'Solve for x: 2x = 10', options: ['2', '4', '5', '10'], answer: '5' },
                { id: 73, level: 'Medium', text: 'What is the largest planet in our solar system?', options: ['Earth', 'Mars', 'Saturn', 'Jupiter'], answer: 'Jupiter' },
                { id: 74, level: 'Medium', text: 'Which gas do plants absorb during photosynthesis?', options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Hydrogen'], answer: 'Carbon Dioxide' },
                { id: 75, level: 'Medium', text: 'What is the chemical symbol for water?', options: ['CO2', 'H2O', 'NaCl', 'O2'], answer: 'H2O' },
                { id: 76, level: 'Medium', text: 'How many continents are there on Earth?', options: ['5', '6', '7', '8'], answer: '7' },
                { id: 77, level: 'Medium', text: 'Who wrote the play "Romeo and Juliet"?', options: ['Charles Dickens', 'Mark Twain', 'William Shakespeare', 'Jane Austen'], answer: 'William Shakespeare' },
                { id: 78, level: 'Medium', text: 'What is 15 x 6?', options: ['75', '80', '90', '95'], answer: '90' },
                { id: 79, level: 'Medium', text: 'Which metal is liquid at room temperature?', options: ['Gold', 'Iron', 'Mercury', 'Copper'], answer: 'Mercury' },
                { id: 80, level: 'Medium', text: 'What is the capital of Japan?', options: ['Seoul', 'Beijing', 'Tokyo', 'Bangkok'], answer: 'Tokyo' },
                { id: 81, level: 'Medium', text: 'What is the square root of 64?', options: ['6', '7', '8', '9'], answer: '8' },
                { id: 82, level: 'Medium', text: 'Who discovered gravity?', options: ['Albert Einstein', 'Isaac Newton', 'Galileo Galilei', 'Nikola Tesla'], answer: 'Isaac Newton' },
                { id: 83, level: 'Medium', text: 'What is the primary language spoken in Brazil?', options: ['Spanish', 'English', 'French', 'Portuguese'], answer: 'Portuguese' },
                { id: 84, level: 'Medium', text: 'Which ocean is the largest?', options: ['Atlantic Ocean', 'Indian Ocean', 'Pacific Ocean', 'Arctic Ocean'], answer: 'Pacific Ocean' },
                { id: 85, level: 'Medium', text: 'How many bones are there in an adult human body?', options: ['206', '208', '210', '212'], answer: '206' },
                { id: 86, level: 'Medium', text: 'Solve: 5 + 3 x 2', options: ['16', '11', '13', '10'], answer: '11' },
                { id: 87, level: 'Medium', text: 'Which layer of the Earth is below the crust?', options: ['Inner Core', 'Outer Core', 'Mantle', 'Atmosphere'], answer: 'Mantle' },
                { id: 88, level: 'Medium', text: 'Who painted the "Mona Lisa"?', options: ['Vincent van Gogh', 'Pablo Picasso', 'Leonardo da Vinci', 'Claude Monet'], answer: 'Leonardo da Vinci' },
                { id: 89, level: 'Medium', text: 'Which chemical element has the symbol "O"?', options: ['Gold', 'Oxygen', 'Osmium', 'Carbon'], answer: 'Oxygen' },
                { id: 90, level: 'Medium', text: 'What is the capital of Canada?', options: ['Toronto', 'Vancouver', 'Montreal', 'Ottawa'], answer: 'Ottawa' },
                { id: 91, level: 'Medium', text: 'What is the smallest prime number?', options: ['0', '1', '2', '3'], answer: '2' },
                { id: 92, level: 'Medium', text: 'Which planet is known as the Red Planet?', options: ['Venus', 'Mars', 'Jupiter', 'Mercury'], answer: 'Mars' },
                { id: 93, level: 'Medium', text: 'What is 100 / 4?', options: ['20', '25', '30', '40'], answer: '25' },
                { id: 94, level: 'Medium', text: 'Who was the first President of the United States?', options: ['Thomas Jefferson', 'Abraham Lincoln', 'George Washington', 'John Adams'], answer: 'George Washington' },
                { id: 95, level: 'Medium', text: 'Which country is home to the Kangaroo?', options: ['South Africa', 'New Zealand', 'Australia', 'Kenya'], answer: 'Australia' },
                { id: 96, level: 'Medium', text: 'What is the boiling point of water in Celsius?', options: ['90°C', '100°C', '110°C', '120°C'], answer: '100°C' },
                { id: 97, level: 'Medium', text: 'What is the capital of Italy?', options: ['Venice', 'Milan', 'Florence', 'Rome'], answer: 'Rome' },
                { id: 98, level: 'Medium', text: 'What is 12 x 12?', options: ['124', '134', '144', '154'], answer: '144' },
                { id: 99, level: 'Medium', text: 'Which gas makes up the majority of Earth\'s atmosphere?', options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Argon'], answer: 'Nitrogen' },
                { id: 100, level: 'Medium', text: 'Who wrote the play "Hamlet"?', options: ['William Shakespeare', 'Charles Dickens', 'Oscar Wilde', 'George Orwell'], answer: 'William Shakespeare' },
                { id: 101, level: 'Medium', text: 'What is the capital of Egypt?', options: ['Cairo', 'Alexandria', 'Luxor', 'Giza'], answer: 'Cairo' },
                { id: 102, level: 'Medium', text: 'What is the square of 9?', options: ['72', '81', '90', '99'], answer: '81' },
                { id: 103, level: 'Medium', text: 'Which country is the largest by land area?', options: ['Canada', 'China', 'USA', 'Russia'], answer: 'Russia' },
                { id: 104, level: 'Medium', text: 'What is the chemical formula for table salt?', options: ['H2O', 'NaCl', 'CO2', 'HCl'], answer: 'NaCl' },
                { id: 105, level: 'Medium', text: 'Which organ in the human body filters waste from the blood?', options: ['Liver', 'Heart', 'Kidneys', 'Lungs'], answer: 'Kidneys' },
                { id: 106, level: 'Medium', text: 'What is 250 + 150?', options: ['300', '350', '400', '450'], answer: '400' },
                { id: 107, level: 'Medium', text: 'Who invented the light bulb?', options: ['Alexander Graham Bell', 'Thomas Edison', 'Nikola Tesla', 'Albert Einstein'], answer: 'Thomas Edison' },
                { id: 108, level: 'Medium', text: 'What is the capital of Germany?', options: ['Munich', 'Frankfurt', 'Berlin', 'Hamburg'], answer: 'Berlin' },
                { id: 109, level: 'Medium', text: 'Which instrument is used to measure temperature?', options: ['Barometer', 'Thermometer', 'Speedometer', 'Altimeter'], answer: 'Thermometer' },
                { id: 110, level: 'Medium', text: 'What is the longest river in the world?', options: ['Amazon River', 'Nile River', 'Yangtze River', 'Mississippi River'], answer: 'Nile River' },
                { id: 111, level: 'Medium', text: 'How many degrees are in a right angle?', options: ['45°', '90°', '180°', '360°'], answer: '90°' },
                { id: 112, level: 'Medium', text: 'Which chemical element has the symbol "Fe"?', options: ['Fluorine', 'Iron', 'Gold', 'Lead'], answer: 'Iron' },
                { id: 113, level: 'Medium', text: 'What is the capital of Spain?', options: ['Barcelona', 'Madrid', 'Seville', 'Valencia'], answer: 'Madrid' },
                { id: 114, level: 'Medium', text: 'Who wrote the novel "1984"?', options: ['George Orwell', 'Aldous Huxley', 'F. Scott Fitzgerald', 'Ernest Hemingway'], answer: 'George Orwell' },
                { id: 115, level: 'Medium', text: 'What is 45 x 2?', options: ['80', '85', '90', '95'], answer: '90' },
                { id: 116, level: 'Medium', text: 'Which planet is closest to the Sun?', options: ['Venus', 'Earth', 'Mars', 'Mercury'], answer: 'Mercury' },
                { id: 117, level: 'Medium', text: 'What is the chemical symbol for Carbon?', options: ['Ca', 'C', 'Co', 'Cr'], answer: 'C' },
                { id: 118, level: 'Medium', text: 'What is the capital of China?', options: ['Shanghai', 'Hong Kong', 'Beijing', 'Guangzhou'], answer: 'Beijing' },
                { id: 119, level: 'Medium', text: 'What is the square root of 121?', options: ['10', '11', '12', '13'], answer: '11' },
                { id: 120, level: 'Medium', text: 'Which country is famous for the Pyramids?', options: ['Greece', 'Italy', 'Egypt', 'Mexico'], answer: 'Egypt' },
                { id: 121, level: 'Medium', text: 'Who painted the ceiling of the Sistine Chapel?', options: ['Michelangelo', 'Leonardo da Vinci', 'Raphael', 'Donatello'], answer: 'Michelangelo' },
                { id: 122, level: 'Medium', text: 'What is 500 - 150?', options: ['300', '350', '400', '450'], answer: '350' },
                { id: 123, level: 'Medium', text: 'Which device is used to connect a computer to the internet?', options: ['Monitor', 'Keyboard', 'Modem', 'Printer'], answer: 'Modem' },
                { id: 124, level: 'Medium', text: 'What is the capital of Russia?', options: ['St. Petersburg', 'Moscow', 'Kiev', 'Sochi'], answer: 'Moscow' },
                { id: 125, level: 'Medium', text: 'How many states are in the United States?', options: ['48', '49', '50', '51'], answer: '50' },
                { id: 126, level: 'Medium', text: 'Who is the author of "Harry Potter"?', options: ['J.R.R. Tolkien', 'J.K. Rowling', 'C.S. Lewis', 'Roald Dahl'], answer: 'J.K. Rowling' },
                { id: 127, level: 'Medium', text: 'What is the capital of Brazil?', options: ['Rio de Janeiro', 'Sao Paulo', 'Brasilia', 'Salvador'], answer: 'Brasilia' },
                { id: 128, level: 'Medium', text: 'Solve for x: x + 7 = 15', options: ['6', '7', '8', '9'], answer: '8' },
                { id: 129, level: 'Medium', text: 'Which galaxy is home to our solar system?', options: ['Andromeda', 'Milky Way', 'Triangulum', 'Sombrero'], answer: 'Milky Way' },
                { id: 130, level: 'Medium', text: 'What is the main ingredient in chocolate?', options: ['Sugar', 'Cocoa beans', 'Milk', 'Vanilla'], answer: 'Cocoa beans' },
                { id: 131, level: 'Medium', text: 'What is the capital of Greece?', options: ['Sparta', 'Athens', 'Thessaloniki', 'Rhodes'], answer: 'Athens' },
                { id: 132, level: 'Medium', text: 'What is 30 x 4?', options: ['100', '110', '120', '130'], answer: '120' },
                { id: 133, level: 'Medium', text: 'Who is known as the "Father of Computers"?', options: ['Alan Turing', 'Charles Babbage', 'Bill Gates', 'Steve Jobs'], answer: 'Charles Babbage' },
                { id: 134, level: 'Medium', text: 'What is the capital of South Africa?', options: ['Johannesburg', 'Cape Town', 'Pretoria', 'Durban'], answer: 'Pretoria' },
                { id: 135, level: 'Medium', text: 'What is the square of 15?', options: ['200', '215', '225', '250'], answer: '225' },
                { id: 139, level: 'Medium', text: 'Which star is at the center of our Solar System?', options: ['Sirius', 'Alpha Centauri', 'Sun', 'Polaris'], answer: 'Sun' },
                { id: 140, level: 'Medium', text: 'What is the capital of Turkey?', options: ['Istanbul', 'Ankara', 'Izmir', 'Antalya'], answer: 'Ankara' },

                // --- HARD (60 questions, IDs 141-200) ---
                // [Math - Retained]
                { id: 141, level: 'Hard', text: 'What is the derivative of x^2?', options: ['x', '2x', 'x^2', '2'], answer: '2x' },
                // [Graduate Level Physics/Chemistry/Biology/History/Geopolitics/Philosophy]
                { id: 142, level: 'Hard', text: 'Which of the following is a primary characteristic of a SN1 reaction mechanism?', options: ['Formation of a carbocation intermediate', 'A single-step concerted pathway', 'Complete stereochemical inversion', 'Rate dependence on nucleophile concentration'], answer: 'Formation of a carbocation intermediate' },
                { id: 143, level: 'Hard', text: 'In quantum mechanics, what does the square of the absolute value of the wave function (|Ψ|^2) represent according to the Born interpretation?', options: ['Probability density of finding the particle', 'Exact kinetic energy of the particle', 'Total mechanical force on the particle', 'Expected value of the particle momentum'], answer: 'Probability density of finding the particle' },
                { id: 144, level: 'Hard', text: 'Which thermodynamic state function represents the total heat content of a system at constant pressure?', options: ['Gibbs Free Energy', 'Helmholtz Free Energy', 'Enthalpy', 'Entropy'], answer: 'Enthalpy' },
                { id: 145, level: 'Hard', text: 'During eukaryotic translation initiation, which codon serves as the primary start codon recognized by initiator tRNA-Met?', options: ['UAG', 'UAA', 'UGA', 'AUG'], answer: 'AUG' },
                // [Math - Retained]
                { id: 146, level: 'Hard', text: 'What is the value of Euler\'s number (e) to two decimal places?', options: ['3.14', '2.71', '1.61', '1.41'], answer: '2.71' },
                // [Graduate Level Material Science/Physiology/Hadron Physics]
                { id: 147, level: 'Hard', text: 'Which crystal structure exhibits the highest atomic packing factor (APF) of approximately 0.74?', options: ['Simple Cubic (SC)', 'Body-Centered Cubic (BCC)', 'Face-Centered Cubic (FCC)', 'Diamond Cubic'], answer: 'Face-Centered Cubic (FCC)' },
                { id: 148, level: 'Hard', text: 'What is the primary physiological mechanism by which the myelin sheath accelerates electrical nerve impulse propagation?', options: ['Decreasing the internal resistance of the axon', 'Enabling continuous depolarization across the membrane', 'Facilitating saltatory conduction at the Nodes of Ranvier', 'Increasing the overall diameter of the axon'], answer: 'Facilitating saltatory conduction at the Nodes of Ranvier' },
                // [Math - Retained]
                { id: 149, level: 'Hard', text: 'Solve for x in: log2(x) = 5', options: ['10', '25', '32', '64'], answer: '32' },
                // [Graduate Level Particle Physics/Economics/Biochemistry/Political Science]
                { id: 150, level: 'Hard', text: 'According to the Standard Model of particle physics, which gauge boson mediates the strong nuclear force between quarks?', options: ['Photon', 'W and Z Bosons', 'Gluon', 'Graviton'], answer: 'Gluon' },
                { id: 151, level: 'Hard', text: 'In macroeconomic theory, what curve illustrates the empirical short-run inverse relationship between inflation and unemployment rates?', options: ['IS-LM Curve', 'Phillips Curve', 'Laffer Curve', 'Lorenz Curve'], answer: 'Phillips Curve' },
                { id: 152, level: 'Hard', text: 'Which metabolic pathway is responsible for converting glucose into two molecules of pyruvate under aerobic conditions?', options: ['Citric Acid Cycle', 'Gluconeogenesis', 'Glycolysis', 'Pentose Phosphate Pathway'], answer: 'Glycolysis' },
                { id: 153, level: 'Hard', text: 'Which treaty, signed in 1648, ended the Thirty Years\' War and formally established the modern concept of westphalian state sovereignty?', options: ['Treaty of Versailles', 'Peace of Westphalia', 'Treaty of Utrecht', 'Congress of Vienna'], answer: 'Peace of Westphalia' },
                { id: 154, level: 'Hard', text: 'According to Maxwell\'s Equations, which law states that magnetic monopoles do not exist?', options: ['Ampere\'s Law', 'Gauss\'s Law for Magnetism', 'Faraday\'s Law of Induction', 'Gauss\'s Law for Electricity'], answer: 'Gauss\'s Law for Magnetism' },
                { id: 155, level: 'Hard', text: 'Which organic chemistry rule states that a planar, monocyclic hydrocarbon ring containing (4n + 2) pi electrons will be aromatic?', options: ['Markovnikov\'s Rule', 'Huckel\'s Rule', 'Zaitsev\'s Rule', 'Hund\'s Rule'], answer: 'Huckel\'s Rule' },
                { id: 156, level: 'Hard', text: 'Which seismic discontinuity serves as the boundary separating the Earth\'s crust from the underlying mantle?', options: ['Gutenberg Discontinuity', 'Mohorovicic Discontinuity', 'Conrad Discontinuity', 'Lehmann Discontinuity'], answer: 'Mohorovicic Discontinuity' },
                // [Math - Retained]
                { id: 157, level: 'Hard', text: 'What is the derivative of sin(x)?', options: ['sin(x)', '-sin(x)', 'cos(x)', '-cos(x)'], answer: 'cos(x)' },
                // [Graduate Level Biochemistry/Classical Mechanics/International Relations]
                { id: 158, level: 'Hard', text: 'Which rate-limiting and committed metabolic enzyme regulates the primary control point of glycolysis?', options: ['Hexokinase', 'Phosphofructokinase-1 (PFK-1)', 'Pyruvate Kinase', 'Phosphoglucose Isomerase'], answer: 'Phosphofructokinase-1 (PFK-1)' },
                { id: 159, level: 'Hard', text: 'In classical mechanics, which analytical formulation utilizes generalized coordinates and the Lagrangian function (L = T - V) to define the path of least action?', options: ['Newtonian mechanics', 'Hamiltonian mechanics', 'Lagrangian mechanics', 'Quantum mechanics'], answer: 'Lagrangian mechanics' },
                { id: 160, level: 'Hard', text: 'In international relations theory, which school of thought argues that states are the primary, rational actors in an anarchic system driven by power maximization and security survival?', options: ['Liberalism', 'Constructivism', 'Realism', 'Marxism'], answer: 'Realism' },
                // [Math - Retained]
                { id: 161, level: 'Hard', text: 'What is the square root of 225?', options: ['13', '14', '15', '16'], answer: '15' },
                // [Graduate Level Astrophysics/Solid State/Economics/Inorganic Chem]
                { id: 162, level: 'Hard', text: 'Which astrophysical effect describes the shift in observed frequency of electromagnetic waves due to the expansion of space itself?', options: ['Doppler Shift', 'Gravitational Redshift', 'Cosmological Redshift', 'Compton Scattering'], answer: 'Cosmological Redshift' },
                // [Math - Retained]
                { id: 163, level: 'Hard', text: 'Solve for x: 3^x = 81', options: ['3', '4', '5', '6'], answer: '4' },
                // [Graduate Level Physics/Keynesianism/Quantum Mechanics]
                { id: 164, level: 'Hard', text: 'What physical phenomenon describes the complete expulsion of magnetic field lines from a superconductor when cooled below its transition temperature?', options: ['Josephson Effect', 'Meissner Effect', 'Zeeman Effect', 'Kondo Effect'], answer: 'Meissner Effect' },
                { id: 165, level: 'Hard', text: 'Which fundamental macroeconomic school of thought advocates for government intervention through active fiscal policy to manage aggregate demand during recessions?', options: ['Monetarism', 'Classical Economics', 'Keynesian Economics', 'Supply-Side Economics'], answer: 'Keynesian Economics' },
                { id: 166, level: 'Hard', text: 'Which inorganic chemistry principle states that no two fermions in a closed system can occupy the exact same quantum state simultaneously?', options: ['Pauli Exclusion Principle', 'Heisenberg Uncertainty Principle', 'Hund\'s Rule', 'Aufbau Principle'], answer: 'Pauli Exclusion Principle' },
                { id: 167, level: 'Hard', text: 'Which endocrine gland layer secretes the mineralocorticoid hormone aldosterone to regulate sodium uptake?', options: ['Adrenal Medulla', 'Zona Glomerulosa of the Adrenal Cortex', 'Zona Fasciculata of the Adrenal Cortex', 'Anterior Pituitary'], answer: 'Zona Glomerulosa of the Adrenal Cortex' },
                { id: 168, level: 'Hard', text: 'In political science, which electoral system allocates legislative representation proportionally based on the overall percentage of popular votes received?', options: ['First-Past-The-Post (FPTP)', 'Proportional Representation (PR)', 'Ranked-Choice Voting (RCV)', 'Alternative Vote'], answer: 'Proportional Representation (PR)' },
                { id: 169, level: 'Hard', text: 'Which literary theory challenges structuralism by arguing that language is inherently unstable, meaning is infinitely deferred, and texts contain internal contradictions?', options: ['New Criticism', 'Psychoanalytic Criticism', 'Deconstruction (Post-Structuralism)', 'Marxist Criticism'], answer: 'Deconstruction (Post-Structuralism)' },
                { id: 170, level: 'Hard', text: 'In physical chemistry, which law states that the solubility of a gas in a liquid is directly proportional to the partial pressure of that gas above the liquid?', options: ['Raoult\'s Law', 'Henry\'s Law', 'Dalton\'s Law', 'Charles\'s Law'], answer: 'Henry\'s Law' },
                // [Math - Retained]
                { id: 171, level: 'Hard', text: 'Solve for x: x^2 - 5x + 6 = 0', options: ['x = 1, 6', 'x = 2, 3', 'x = -2, -3', 'x = 0, 5'], answer: 'x = 2, 3' },
                // [Graduate Level Quantum Physics/Tectonics/Wave Optics/Thermodynamics]
                { id: 172, level: 'Hard', text: 'Which quantum mechanical phenomenon allows a particle to pass through a classically impassable potential energy barrier?', options: ['Quantum Superposition', 'Quantum Tunneling', 'Quantum Entanglement', 'Photoelectric Effect'], answer: 'Quantum Tunneling' },
                { id: 173, level: 'Hard', text: 'Which radioactive decay process is primarily utilized in radiocarbon dating to determine the age of ancient organic matter?', options: ['Alpha decay of Carbon-14', 'Beta-minus decay of Carbon-14', 'Gamma decay of Nitrogen-14', 'Electron capture of Carbon-14'], answer: 'Beta-minus decay of Carbon-14' },
                { id: 174, level: 'Hard', text: 'What type of tectonic plate boundary is characterized by horizontal shear stress, where two tectonic plates slide laterally past each other?', options: ['Divergent Boundary', 'Convergent Boundary', 'Transform Boundary', 'Subduction Zone'], answer: 'Transform Boundary' },
                { id: 175, level: 'Hard', text: 'Which wave optics phenomenon refers to the spreading and bending of light waves when passing through a narrow aperture or obstacle?', options: ['Refraction', 'Diffraction', 'Polarization', 'Total Internal Reflection'], answer: 'Diffraction' },
                { id: 176, level: 'Hard', text: 'Which thermodynamic law establishes that the entropy of a perfect pure crystalline substance at absolute zero temperature (0 Kelvin) is exactly zero?', options: ['First Law of Thermodynamics', 'Second Law of Thermodynamics', 'Third Law of Thermodynamics', 'Zeroth Law of Thermodynamics'], answer: 'Third Law of Thermodynamics' },
                // [Math - Retained]
                { id: 177, level: 'Hard', text: 'Solve for x: e^x = 1', options: ['x = 0', 'x = 1', 'x = e', 'x = -1'], answer: 'x = 0' },
                // [Graduate Level Microelectronics/Physical Chemistry/Political Philosophy]
                { id: 178, level: 'Hard', text: 'Which semiconductor device operates by applying a voltage to a gate terminal to create an electric field that modulates channel conductivity?', options: ['Bipolar Junction Transistor (BJT)', 'Metal-Oxide-Semiconductor Field-Effect Transistor (MOSFET)', 'Schottky Diode', 'Zener Diode'], answer: 'Metal-Oxide-Semiconductor Field-Effect Transistor (MOSFET)' },
                { id: 179, level: 'Hard', text: 'In chemical kinetics, which equation mathematically expresses the relationship between a reaction\'s rate constant and its activation energy?', options: ['Gibbs-Helmholtz Equation', 'Arrhenius Equation', 'Nernst Equation', 'Clapeyron Equation'], answer: 'Arrhenius Equation' },
                { id: 180, level: 'Hard', text: 'In political philosophy, which foundational text by Thomas Hobbes conceptualizes a powerful, undivided absolute sovereign required to prevent a chaotic "war of all against all"?', options: ['The Social Contract', '"Two Treatises of Government"', 'Leviathan', 'The Prince'], answer: 'Leviathan' },
                { id: 181, level: 'Hard', text: 'Which electrodynamics law, when modified by James Clerk Maxwell, relates a closed loop magnetic field to both conduction current and displacement current?', options: ['Gauss\'s Law', 'Faraday\'s Law', 'Ampere\'s Law', 'Lenz\'s Law'], answer: 'Ampere\'s Law' },
                { id: 182, level: 'Hard', text: 'Which coordination complex is a widely prescribed square planar platinum drug that kills cancer cells by binding to and cross-linking DNA?', options: ['Carboplatin', 'Cisplatin', 'Oxaliplatin', 'Ferrocene'], answer: 'Cisplatin' },
                { id: 183, level: 'Hard', text: 'Which cell organelle is responsible for post-translational chemical modification, spatial sorting, and transport of synthesized proteins?', options: ['Rough Endoplasmic Reticulum', 'Golgi Apparatus', 'Lysosome', 'Peroxisome'], answer: 'Golgi Apparatus' },
                { id: 184, level: 'Hard', text: 'In economic demography, what term describes the historical transition of a society from high birth and death rates to low birth and death rates as it industrializes?', options: ['Malthusian Trap', 'Demographic Transition Model', 'Kuznets Curve', 'Solow-Swan Growth model'], answer: 'Demographic Transition Model' },
                { id: 185, level: 'Hard', text: 'Which structuralist geopolitical school of thought, popularized by Immanuel Wallerstein, divides the global economy into Core, Semi-Periphery, and Periphery zones?', options: ['Neo-liberalism', 'World-Systems Theory', 'Classical Geopolitics', 'Dependency Theory'], answer: 'World-Systems Theory' },
                { id: 186, level: 'Hard', text: 'In statistical mechanics, which formula (derived by Ludwig Boltzmann) defines thermodynamic entropy (S) in terms of the number of microstates (W) available?', options: ['S = k * ln(W)', 'S = dQ / T', 'H = U + PV', 'G = H - TS'], answer: 'S = k * ln(W)' },
                { id: 187, level: 'Hard', text: 'Which cell type in the pancreatic islets of Langerhans synthesizes and secretes the peptide hormone insulin?', options: ['Alpha cells', 'Beta cells', 'Delta cells', 'PP cells'], answer: 'Beta cells' },
                { id: 188, level: 'Hard', text: 'In urban geography, which classical model represents urban development through concentric rings expanding outwards from a Central Business District?', options: ['Hoyt Sector Model', 'Harris-Ullman Multiple Nuclei Model', 'Burgess Concentric Zone Model', 'Vance Vance Model'], answer: 'Burgess Concentric Zone Model' },
                { id: 189, level: 'Hard', text: 'In existentialist philosophy, which prominent figure argued that human beings are "condemned to be free," defining existential freedom in his work "Being and Nothingness"?', options: ['Albert Camus', 'Jean-Paul Sartre', 'Friedrich Nietzsche', 'Martin Heidegger'], answer: 'Jean-Paul Sartre' },
                { id: 190, level: 'Hard', text: 'Which spectroscopic method uses radiofrequency pulses in a magnetic field to analyze spin states of nuclei for structural determination of molecules?', options: ['Infrared Spectroscopy (IR)', 'Nuclear Magnetic Resonance (NMR) Spectroscopy', 'Mass Spectrometry (MS)', 'UV-Vis Spectroscopy'], answer: 'Nuclear Magnetic Resonance (NMR) Spectroscopy' },
                // [Math - Retained]
                { id: 191, level: 'Hard', text: 'Solve for x: log10(x) = 3', options: ['10', '100', '1000', '10000'], answer: '1000' },
                // [Graduate Level Hadron Physics/International Finance/Cell Signaling/Cold War Origins/Electrodynamics/Viscosity/East Asian Geopolitics]
                { id: 192, level: 'Hard', text: 'According to quantum chromodynamics, what specific combination of quarks constitutes a proton?', options: ['One up and two down quarks', 'Two up and one down quarks', 'Three up quarks', 'One up, one down, and one strange quark'], answer: 'Two up and one down quarks' },
                { id: 193, level: 'Hard', text: 'What 1944 international financial agreement established the rules for commercial relations among industrial states and led to the creation of the IMF and World Bank?', options: ['Treaty of Versailles', 'Bretton Woods Agreement', 'Plaza Accord', 'Maastricht Treaty'], answer: 'Bretton Woods Agreement' },
                { id: 194, level: 'Hard', text: 'Which evolutionary signaling pathway is critically involved in regulating animal embryonic development, axis specification, and adult stem cell maintenance?', options: ['JAK/STAT Pathway', 'Wnt Signaling Pathway', 'MAPK Pathway', 'GPCR Signaling Pathway'], answer: 'Wnt Signaling Pathway' },
                { id: 195, level: 'Hard', text: 'Which Allied conference, held in February 1945, outlined the post-war partition of Germany and the establishment of Soviet influence in Eastern Europe?', options: ['Potsdam Conference', 'Tehran Conference', 'Yalta Conference', 'Casablanca Conference'], answer: 'Yalta Conference' },
                { id: 196, level: 'Hard', text: 'Which electrostatic law mathematically relates the net electric flux through any closed Gaussian surface to the enclosed net electric charge?', options: ['Coulomb\'s Law', 'Gauss\'s Law', 'Ampere\'s Law', 'Faraday\'s Law'], answer: 'Gauss\'s Law' },
                { id: 197, level: 'Hard', text: 'In fluid dynamics, which equation models the conservation of momentum for incompressible Newtonian fluids under viscous forces?', options: ['Euler Equation', 'Bernoulli\'s Equation', 'Navier-Stokes Equations', 'Continuity Equation'], answer: 'Navier-Stokes Equations' },
                { id: 198, level: 'Hard', text: 'Which historical Japanese period (1603-1867) saw domestic stability under the Tokugawa Shogunate coupled with strict isolationist policies (Sakoku)?', options: ['Heian Period', 'Muromachi Period', 'Edo Period', 'Meiji Period'], answer: 'Edo Period' },
                // [Math - Retained]
                { id: 199, level: 'Hard', text: 'Solve for x: x^2 = 169', options: ['x = 11', 'x = 12', 'x = 13', 'x = 14'], answer: '13' },
                // [Graduate Level Chemistry - Solubility/Henry's law]
                { id: 200, level: 'Hard', text: 'Which thermodynamic equation describes the relationship between the equilibrium constant of a chemical reaction and temperature?', options: ['Arrhenius Equation', 'van \'t Hoff Equation', 'Nernst Equation', 'Gibbs-Duhem Equation'], answer: 'van \'t Hoff Equation' }
            ];

            const stmt = db.prepare("INSERT OR IGNORE INTO content_blocks (id, difficulty_level, question_text, options, correct_answer) VALUES (?, ?, ?, ?, ?)");
            questions.forEach(q => {
                stmt.run(q.id, q.level, q.text, JSON.stringify(q.options), q.answer);
            });
            stmt.finalize();
        });
    }
});

// Wrap sqlite3 queries in promises to mimic pg syntax
module.exports = {
    query: (text, params) => {
        return new Promise((resolve, reject) => {
            // Replace $1, $2 with ? for sqlite
            const sqliteQuery = text.replace(/\$\d+/g, '?');
            
            if (sqliteQuery.trim().toUpperCase().startsWith('SELECT')) {
                db.all(sqliteQuery, params, (err, rows) => {
                    if (err) reject(err);
                    else resolve({ rows });
                });
            } else {
                db.run(sqliteQuery, params, function(err) {
                    if (err) reject(err);
                    else resolve({ rows: [], lastID: this.lastID, changes: this.changes });
                });
            }
        });
    }
};
