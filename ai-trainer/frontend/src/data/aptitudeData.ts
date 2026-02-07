import type { Topic, Question } from '../types/learning';

// Topic data from Aptitude_Final.xlsx
export const TOPICS: Topic[] = [
  {
    id: 1,
    name: 'Percentage',
    definition: 'A number or ratio expressed as a fraction of 100.',
    description: `### Percentage: Comprehensive Theory

**1. What is Percentage?**
• Percentage is one of the most important topics in quantitative aptitude and forms the foundation for many other topics like profit and loss, ratio and proportion, simple interest, compound interest, and data interpretation.
• The word percentage comes from the Latin term "per centum" which means per hundred.
• A percentage is used to represent a number as a part of 100, making comparison easier between quantities.
• The symbol used for percentage is %.
• For example, 50% means 50 out of 100, 25% means 25 out of 100, and 100% represents the whole value.

**2. Importance and Uses of Percentage**
• Percentages are widely used in daily life such as exam results, shopping discounts, banking interest rates, population growth, business profits, and engineering efficiency calculations.
• Percentages help in standardizing values and allow easy comparison even when total quantities are different.
• In engineering and aptitude exams, percentage problems are frequently asked and form the base for many other calculations.

**3. Basic Formula of Percentage**
• The basic formula used to calculate percentage is Percentage = (Part ÷ Whole) × 100.
• This formula is used whenever a value needs to be expressed as a part of the total.
• For example, if a student scores 45 marks out of 60, the percentage is calculated as (45 ÷ 60) × 100 = 75%.

**4. Conversion of Fractions and Decimals into Percentage**
• To convert a fraction into a percentage, divide the numerator by the denominator and multiply the result by 100.
• For example, 3/5 = (3 ÷ 5) × 100 = 60%.
• To convert a decimal into a percentage, multiply the decimal number by 100.
• For example, 0.75 × 100 = 75%.

**5. Conversion of Percentage into Fraction and Decimal**
• To convert percentage into fraction, write the percentage value over 100 and simplify it.
• For example, 40% = 40/100 = 2/5.
• To convert percentage into decimal, divide the percentage value by 100.
• For example, 25% = 25 ÷ 100 = 0.25.

**6. Percentage Increase**
• Percentage increase is used when a value becomes higher than its original value.
• The formula for percentage increase is Percentage Increase = (Increase ÷ Original Value) × 100.
• For example, if the price of a product increases from ₹200 to ₹250, the increase is ₹50.
• The percentage increase is calculated as (50 ÷ 200) × 100 = 25%.

**7. Percentage Decrease**
• Percentage decrease is used when a value becomes lower than its original value.
• The formula for percentage decrease is Percentage Decrease = (Decrease ÷ Original Value) × 100.
• For example, if the price of an item decreases from ₹500 to ₹400, the decrease is ₹100.
• The percentage decrease is calculated as (100 ÷ 500) × 100 = 20%.

**8. Finding Value After Percentage Change**
• To find the new value after a percentage increase, the formula used is New Value = Original Value × (1 + Percentage ÷ 100).
• For example, increasing ₹1000 by 10% gives a new value of ₹1100.
• To find the new value after a percentage decrease, the formula used is New Value = Original Value × (1 − Percentage ÷ 100).
• For example, decreasing ₹2000 by 15% gives a new value of ₹1700.

**9. Percentage in Comparison Problems**
• Percentages are commonly used to compare two quantities.
• If A is 20% more than B, it means A is equal to 120% of B.
• If B is taken as 100, then A becomes 120.

**10. Successive Percentage Change**
• Successive percentage change occurs when more than one percentage change is applied one after another.
• In such cases, percentages should never be added directly.
• The formula used is Net Change Percentage = a + b + (ab ÷ 100).
• For example, if a value increases by 10% and then by 20%, the net increase is 32%.

**11. Real-Life Applications of Percentage**
• Percentages are used in discounts, marks calculation, salary increments, population growth, and business analysis.
• For example, a laptop costing ₹50,000 with a 20% discount gives a discount of ₹10,000 and a final price of ₹40,000.
• If a student answers 72 out of 90 questions correctly, the percentage score is 80%.

**12. Common Mistakes by Students**
• Forgetting to multiply by 100 during calculations.
• Choosing the wrong base value.
• Adding successive percentages directly.
• Confusing percentage increase with decrease.
• Errors in converting fractions and decimals.

**13. Tips to Solve Percentage Questions Faster**
• Memorize common percentage and fraction equivalents such as 50% = 1/2, 25% = 1/4, 20% = 1/5, and 10% = 1/10.
• Use approximation techniques to save time.
• Practice mental calculations for multiples of 10%.
• Always identify the base value before solving the problem.

**14. Importance of Percentage in Aptitude Exams**
• Percentage is a core topic in quantitative aptitude.
• It acts as a foundation for profit and loss, interest calculations, ratio and proportion, and data interpretation.
• A strong understanding of percentage helps engineering students perform better in competitive exams and placement tests.`,
    videoUrl: 'https://www.youtube.com/embed/YvLIPPgkJN8',
    level: 'Beginner',
    icon: '📊'
  },
  {
    id: 2,
    name: 'Number Series',
    definition: 'A sequence of numbers following a specific logical pattern.',
    description: `### Number Series: Logic and Patterns

**1. What is Number Series?**
• Number Series is an important topic in quantitative aptitude where a sequence of numbers is given and students are required to find the next number, missing number, wrong number, or pattern used in the series.
• A number series follows a specific rule or pattern based on mathematical operations.
• Understanding number series helps in improving logical thinking and problem-solving ability.
• This topic is very common in aptitude tests, competitive exams, and campus placement tests for engineering students.

**2. Importance of Number Series in Aptitude**
• Number series questions test analytical thinking rather than direct formula application.
• These questions help evaluate how quickly a student can identify patterns.
• Number series concepts are also useful in reasoning and data analysis problems.
• A strong command over number series improves overall aptitude performance.

**3. Types of Number Series**
• Number series questions are mainly divided into different types based on the pattern used.
• Identifying the type of series is the first and most important step in solving such questions.

**4. Arithmetic Number Series**
• In arithmetic series, the difference between consecutive numbers remains constant.
• The pattern follows addition or subtraction of a fixed number.
• Example: 2, 5, 8, 11, 14
• Here, each number increases by 3.
• Arithmetic series are the easiest type of number series and commonly asked in exams.

**5. Geometric Number Series**
• In geometric series, each number is multiplied or divided by a fixed number to get the next term.
• The pattern follows multiplication or division.
• Example: 2, 4, 8, 16, 32
• Each number is multiplied by 2.
• Example with division: 81, 27, 9, 3
• Each number is divided by 3.

**6. Alternating Number Series**
• Alternating series consist of two or more patterns occurring alternately.
• Odd position numbers follow one pattern and even position numbers follow another pattern.
• Example: 2, 6, 4, 12, 8, 24
• Odd terms: 2, 4, 8 (multiplied by 2)
• Even terms: 6, 12, 24 (multiplied by 2)

**7. Series Based on Addition and Multiplication**
• Some series involve a combination of addition and multiplication.
• Example: 2, 6, 18, 54
• Each number is multiplied by 3.
• Another example: 3, 7, 15, 31
• Pattern: Multiply by 2 and add 1.

**8. Series Based on Squares and Cubes**
• Many number series are based on squares or cubes of natural numbers.
• Square series example: 1, 4, 9, 16, 25
• These are squares of 1, 2, 3, 4, and 5.
• Cube series example: 1, 8, 27, 64
• These are cubes of 1, 2, 3, and 4.
• Engineering students should memorize squares and cubes up to at least 20.

**9. Prime Number Series**
• Prime number series are based on prime numbers.
• Prime numbers are numbers that have only two factors: 1 and itself.
• Example: 2, 3, 5, 7, 11, 13
• Prime number series questions are common in aptitude exams.

**10. Fibonacci Series**
• In Fibonacci series, each number is the sum of the previous two numbers.
• Example: 0, 1, 1, 2, 3, 5, 8, 13
• Fibonacci series questions are frequently asked and easy to identify.
• Sometimes variations of Fibonacci series are also used.

**11. Difference-Based Number Series**
• In difference-based series, the difference between consecutive numbers follows a pattern.
• Example: 2, 5, 10, 17, 26
• Differences are: 3, 5, 7, 9
• The differences follow an increasing odd number pattern.
• Identifying the difference pattern helps find the next term.

**12. Series Based on Mixed Operations**
• Some number series involve mixed operations such as addition, subtraction, multiplication, and division together.
• Example: 10, 12, 24, 26, 52
• Pattern: +2, ×2, +2, ×2
• Such series require careful observation.

**13. Finding the Missing Number in a Series**
• In missing number questions, one term is replaced by a blank.
• Students must identify the pattern and find the missing value.
• These questions test accuracy and pattern recognition skills.
• Always check the series from left to right and sometimes from right to left.

**14. Finding the Wrong Number in a Series**
• In wrong number series, one number does not follow the pattern.
• The task is to identify the incorrect term.
• Example: 2, 4, 8, 15, 16
• The correct pattern is multiplying by 2, so 15 is the wrong number.

**15. Common Mistakes Made by Students**
• Checking only one pattern and ignoring others.
• Missing alternating patterns.
• Making calculation errors in differences or multiplication.
• Rushing without fully analyzing the series.
• Ignoring squares, cubes, or prime number possibilities.

**16. Tips to Solve Number Series Faster**
• First check simple patterns like addition, subtraction, multiplication, or division.
• Look for alternating patterns.
• Check differences between numbers.
• Consider squares, cubes, and prime numbers.
• Practice mental math regularly to improve speed.
• Avoid overthinking; most exam questions follow simple logic.

**17. Importance of Number Series for Engineering Students**
• Number series improves logical reasoning and numerical ability.
• It helps in clearing aptitude rounds of campus placements.
• This topic strengthens problem-solving confidence.
• Regular practice of number series leads to faster pattern recognition.`,
    videoUrl: 'https://www.youtube.com/embed/nfovdgA2tuw',
    level: 'Intermediate',
    icon: '🔢'
  },
  {
    id: 3,
    name: 'Profit and Loss',
    definition: 'Calculations related to the cost price and selling price of goods.',
    description: `### Profit and Loss: Business Logic

**1. What is Profit and Loss?**
• Profit and Loss is a key topic in quantitative aptitude that deals with the buying and selling of goods and finding how much gain or loss is made.
• Understanding profit and loss helps in business decision making and is widely asked in competitive exams and placement tests.
• It involves basic percentage, cost price, selling price, and real-life examples like shopping and trading.

**2. Important Terms**
• Cost Price (CP): The price at which an item is bought.
• Selling Price (SP): The price at which an item is sold.
• Profit: When SP is more than CP.
• Loss: When SP is less than CP.
• Marked Price (MP): The listed price before any discount.
• Discount: Reduction given on the Marked Price.

**3. Basic Formulas for Profit and Loss**
• Profit = SP − CP (When SP > CP)
• Loss = CP − SP (When SP < CP)
• Profit % = (Profit ÷ CP) × 100
• Loss % = (Loss ÷ CP) × 100

**4. Example of Profit**
• A shopkeeper buys an item for ₹500 and sells it for ₹650.
• Profit = 650 − 500 = ₹150.
• Profit % = (150 ÷ 500) × 100 = 30%.
• So the profit is 30%.

**5. Example of Loss**
• A seller buys a shirt for ₹800 and sells it for ₹720.
• Loss = 800 − 720 = ₹80.
• Loss % = (80 ÷ 800) × 100 = 10%.
• So the loss is 10%.

**6. Marked Price and Discount**
• Sometimes goods are sold at a discount on the marked price.
• Discount = MP − SP.
• Discount % = (Discount ÷ MP) × 100.
• Example: An item has a marked price of ₹1000 and is sold for ₹900.
• Discount = 1000 − 900 = ₹100.
• Discount % = (100 ÷ 1000) × 100 = 10%.

**7. Relationship Between Marked Price and Cost Price**
• If a product has a discount on its marked price, the actual cost price is used for profit and loss calculation.
• For example, item MP = ₹1200 with 20% discount.
• SP becomes: 1200 × (1 − 20/100) = 1200 × 0.8 = ₹960.
• If CP = ₹800, then Profit = 960 − 800 = ₹160, Profit % = (160 ÷ 800) × 100 = 20%.

**8. Successive Discounts**
• Sometimes more than one discount is applied one after another.
• Successive discounts are not added directly.
• Example: Price = ₹1000, 10% discount then 20% discount.
• First discount: 1000 × 10% = 100. So new price = 900.
• Second: 900 × 20% = 180. So final price = 720.
• Total discount is greater than 30%.

**9. Cost Price from Selling Price and Profit %**
• To find CP when SP and profit % are known:
• CP = SP ÷ (1 + Profit %/100).
• Example: SP = ₹840 and profit % = 20%.
• CP = 840 ÷ (1 + 20/100) = 840 ÷ 1.2 = ₹700.

**10. Selling Price from Cost Price and Profit %**
• SP = CP × (1 + Profit %/100).
• Example: CP = ₹400 and profit % = 25%.
• SP = 400 × 1.25 = ₹500.

**11. Selling Price from Cost Price and Loss %**
• SP = CP × (1 − Loss %/100).
• Example: CP = ₹600 and loss % = 15%.
• SP = 600 × 0.85 = ₹510.

**12. Profit and Loss with Multiple Items**
• When dealing with more than one item, calculate profit or loss for each item then add overall.
• Example: Item A profit = ₹50, Item B loss = ₹30.
• Net result = 50 − 30 = ₹20 profit.

**13. Common Mistakes by Students**
• Not identifying whether it is profit or loss.
• Forgetting to convert percentages to decimals.
• Mixing up CP and SP while calculating.
• Adding successive discounts directly.

**14. Tips for Fast Calculation**
• Always find SP and CP before percentages.
• Convert profit or loss into decimal by dividing by 100.
• Use shortcuts for simple numbers.
• Practice questions with real values to improve speed.

**15. Real-Life Examples of Profit and Loss**
• Shopping discounts during sales.
• Buying phone accessories and selling online.
• Business deals and stock trades.
• Annual budgets and price changes.

**16. Importance of Profit and Loss for Engineering Students**
• Helps in placement exams and competitive tests.
• Improves financial understanding.
• Strengthens logical and numerical ability.
• Useful for entrepreneurship and business decisions.`,
    videoUrl: 'https://www.youtube.com/embed/bad9MuH68WU',
    level: 'Intermediate',
    icon: '💰'
  },
  {
    id: 4,
    name: 'Ratio & Proportion',
    definition: 'The quantitative relation between two amounts.',
    description: `### Ratio and Proportion: Core Theory

**1. What is Ratio?**
• Ratio is a comparison between two or more quantities of the same kind and in the same units.
• It shows how many times one quantity is greater or smaller than another.
• Ratio is written using the symbol ":" and read as "is to".
• For example, the ratio 2:3 means for every 2 units of the first quantity, there are 3 units of the second quantity.
• Ratio does not have any unit because the units cancel out during comparison.

**2. Importance of Ratio in Aptitude**
• Ratio is a basic topic in quantitative aptitude and is used in many other topics such as proportion, mixture and allegation, time and work, averages, and profit and loss.
• Ratio problems test logical thinking and numerical understanding.
• Engineering students frequently face ratio questions in campus placements and competitive exams.

**3. Simplifying a Ratio**
• A ratio should always be simplified to its lowest form.
• Simplification is done by dividing both terms of the ratio by their highest common factor (HCF).
• Example: Ratio of 20:30 can be simplified by dividing both numbers by 10.
• So, 20:30 becomes 2:3.
• Simplified ratios make calculations easier.

**4. Types of Ratios**
• Simple Ratio: Comparison of two quantities, such as 3:5.
• Compound Ratio: Combination of two or more ratios, such as (2:3) and (4:5).
• Duplicate Ratio: Ratio of squares of numbers, such as (a²:b²).
• Triplicate Ratio: Ratio of cubes of numbers, such as (a³:b³).
• Inverse Ratio: When one quantity increases while the other decreases.

**5. What is Proportion?**
• Proportion is the equality of two ratios.
• When two ratios are equal, they are said to be in proportion.
• It is written using the symbol "::".
• Example: 2:4 :: 3:6 because both ratios are equal to 1:2.
• Proportion helps in solving problems involving relationships between quantities.

**6. Terms Used in Proportion**
• In the proportion a:b :: c:d,
• "a" and "d" are called extremes.
• "b" and "c" are called means.
• A basic property of proportion is that the product of extremes equals the product of means.
• That is, a × d = b × c.

**7. Direct Proportion**
• In direct proportion, when one quantity increases, the other quantity also increases in the same ratio.
• Similarly, when one quantity decreases, the other also decreases.
• Example: If the number of workers increases, the amount of work done increases.
• Example: If 5 pens cost ₹50, then 10 pens will cost ₹100.
• Cost is directly proportional to quantity.

**8. Inverse Proportion**
• In inverse proportion, when one quantity increases, the other quantity decreases.
• Example: If more workers are employed, the time taken to complete the work decreases.
• If 10 workers complete a task in 6 days, then 20 workers will complete it in 3 days.
• Number of workers and time are inversely proportional.

**9. Dividing a Quantity in a Given Ratio**
• Many problems involve dividing a total quantity in a given ratio.
• Example: Divide ₹1000 in the ratio 2:3.
• Total parts = 2 + 3 = 5.
• First share = (2/5) × 1000 = ₹400.
• Second share = (3/5) × 1000 = ₹600.

**10. Ratio Between Three Quantities**
• Sometimes ratios involve three quantities.
• Example: A:B:C = 2:3:5.
• This means for every 2 units of A, there are 3 units of B and 5 units of C.
• Such ratios are used in distribution and comparison problems.

**11. Converting Ratio into Fraction and Percentage**
• Ratio can be converted into fraction by dividing the first term by the second term.
• Example: Ratio 2:5 = 2/5.
• Ratio can be converted into percentage by multiplying the fraction by 100.
• Example: 2/5 × 100 = 40%.

**12. Common Mistakes Made by Students**
• Comparing quantities with different units without converting them.
• Forgetting to simplify ratios.
• Confusing direct proportion with inverse proportion.
• Making calculation errors while dividing quantities.
• Not identifying the correct relationship between quantities.

**13. Tips to Solve Ratio and Proportion Questions Faster**
• Always convert quantities into the same unit before forming ratios.
• Simplify ratios at the beginning.
• Identify whether the relationship is direct or inverse.
• Use fraction method for quick calculations.
• Practice common ratio values to improve speed.

**14. Real-Life Applications of Ratio and Proportion**
• Mixing ingredients in cooking.
• Speed and distance calculations.
• Distribution of money or resources.
• Engineering design and scale models.
• Budget planning and business sharing.

**15. Importance of Ratio and Proportion for Engineering Students**
• Helps in understanding relationships between quantities.
• Essential for aptitude and placement exams.
• Builds a strong foundation for advanced mathematical concepts.
• Improves analytical and logical thinking skills.`,
    videoUrl: 'https://www.youtube.com/embed/UzH3Q2vqAxc',
    level: 'Beginner',
    icon: '⚖️'
  },
  {
    id: 5,
    name: 'Time and Work',
    definition: 'The relationship between people, time, and work output.',
    description: `### Time and Work: Detailed Efficiency Theory

**1. What is Time and Work?**
• Time and Work is an important topic in quantitative aptitude that deals with calculating how much time is required to complete a task when the number of workers or efficiency is given.
• This topic is based on the simple logic that more workers can complete work faster and fewer workers take more time.
• Time and work problems are commonly asked in aptitude tests, competitive exams, and campus placement exams for engineering students.

**2. Basic Concept of Time and Work**
• If a person can complete a work in 'T' days, then the work done by that person in one day is 1/T.
• Total work is always taken as 1 unit for simplicity.
• Work done is directly proportional to efficiency and time.

**3. Important Formula of Time and Work**
• Work = Efficiency × Time
• Time = Work ÷ Efficiency
• Efficiency = Work ÷ Time
• If A can do a work in 10 days, then A's one-day work = 1/10.
• If B can do the same work in 20 days, then B's one-day work = 1/20.

**4. Work Done by Two or More Persons Together**
• When two persons work together, their combined efficiency is the sum of their individual efficiencies.
• Example: If A can do a work in 10 days and B can do it in 20 days.
• A's one-day work = 1/10 and B's one-day work = 1/20.
• Combined work per day = 1/10 + 1/20 = 3/20.
• Time required to complete the work = 20/3 days.

**5. Finding Individual Time from Combined Work**
• Sometimes combined working time is given and individual time must be found.
• Example: A and B together can do a work in 6 days and A alone can do it in 10 days.
• Combined one-day work = 1/6.
• A's one-day work = 1/10.
• B's one-day work = 1/6 − 1/10 = 1/15.
• So B alone can complete the work in 15 days.

**6. Efficiency Ratio Concept**
• Efficiency is inversely proportional to time.
• If A can do a work in 10 days and B in 20 days, then efficiency ratio A:B = 2:1.
• Higher efficiency means less time is required to complete work.
• Efficiency ratio is useful when multiple workers are involved.

**7. Work and Wages**
• Wages are distributed based on work done, not time spent.
• If two persons work together and earn money, wages should be divided according to their efficiencies.
• Example: If A and B work together and earn ₹300 and their efficiency ratio is 2:1, then A gets ₹200 and B gets ₹100.

**8. Men, Women, and Children Based Problems**
• Sometimes problems involve men, women, and children having different efficiencies.
• Example: 1 man = 2 women = 3 children.
• Always convert all workers into one common unit before solving the problem.
• This type of problem requires careful reading and unit conversion.

**9. Pipes and Cisterns Concept (Related Topic)**
• Pipes filling a tank are treated as positive work.
• Pipes emptying a tank are treated as negative work.
• If a pipe fills a tank in 10 hours, its one-hour work is 1/10.
• If another pipe empties it in 20 hours, its one-hour work is −1/20.
• Net work per hour = 1/10 − 1/20 = 1/20.
• Time taken to fill the tank = 20 hours.

**10. Work with Different Days or Shifts**
• Some problems involve workers working on alternate days or specific shifts.
• Such problems should be broken into parts.
• Always calculate work done in one cycle and then scale it up.

**11. Finding Total Work Using LCM Method**
• Sometimes total work is assumed as the LCM of given days to avoid fractions.
• Example: If A can do work in 10 days and B in 15 days.
• LCM of 10 and 15 is 30.
• A's one-day work = 3 units and B's one-day work = 2 units.
• Total work = 30 units.

**12. Common Mistakes Made by Students**
• Forgetting to convert time into work per day.
• Adding days directly instead of efficiencies.
• Making calculation mistakes with fractions.
• Not identifying whether work is positive or negative.
• Ignoring efficiency ratios.

**13. Tips to Solve Time and Work Questions Faster**
• Use unit work method for clarity.
• Prefer LCM method to avoid fractions.
• Always calculate one-day work first.
• Read the question carefully to identify type.
• Practice regularly to improve speed and accuracy.

**14. Real-Life Applications of Time and Work**
• Project completion planning.
• Team management and workload distribution.
• Construction and manufacturing processes.
• Software development task estimation.
• Engineering project scheduling.

**15. Importance of Time and Work for Engineering Students**
• Improves logical thinking and planning skills.
• Essential for placement and aptitude exams.
• Helps in understanding teamwork and efficiency.
• Useful in real engineering and management scenarios.`,
    videoUrl: 'https://www.youtube.com/embed/KE7tQf9spPg',
    level: 'Hard',
    icon: '⏱️'
  }
];

// Quiz questions from Aptitude_Quiz.xlsx
export const QUESTIONS: Question[] = [
  // Percentage Questions (Topic 1)
  { id: 1, topicId: 1, text: 'What is 15% of 200?', options: ['20', '30', '40', '50'], correctAnswer: '30' },
  { id: 2, topicId: 1, text: 'If a price increases from $50 to $60, what is the % increase?', options: ['10%', '15%', '20%', '25%'], correctAnswer: '20%' },
  { id: 3, topicId: 1, text: 'Convert 3/4 into percentage.', options: ['25%', '50%', '75%', '80%'], correctAnswer: '75%' },
  { id: 4, topicId: 1, text: 'A student scores 450 out of 600. What is the percentage?', options: ['65%', '70%', '75%', '80%'], correctAnswer: '75%' },
  { id: 5, topicId: 1, text: 'If 20% of a number is 40, what is the number?', options: ['100', '150', '200', '250'], correctAnswer: '200' },

  // Number Series Questions (Topic 2)
  { id: 6, topicId: 2, text: 'Complete the series: 2, 6, 12, 20, ?', options: ['24', '28', '30', '32'], correctAnswer: '30' },
  { id: 7, topicId: 2, text: 'What is the next prime number after 13?', options: ['15', '17', '19', '21'], correctAnswer: '17' },
  { id: 8, topicId: 2, text: 'Find the missing number: 1, 4, 9, 16, ?', options: ['20', '24', '25', '30'], correctAnswer: '25' },
  { id: 9, topicId: 2, text: 'Find the pattern: 100, 90, 80, 70, ?', options: ['65', '60', '55', '50'], correctAnswer: '60' },
  { id: 10, topicId: 2, text: 'What comes next: 3, 9, 27, 81, ?', options: ['162', '243', '300', '100'], correctAnswer: '243' },

  // Profit and Loss Questions (Topic 3)
  { id: 11, topicId: 3, text: 'A man buys a toy for $100 and sells it for $120. Find profit %.', options: ['10%', '15%', '20%', '25%'], correctAnswer: '20%' },
  { id: 12, topicId: 3, text: 'Cost price is $500 and loss is 10%. Find Selling Price.', options: ['$400', '$450', '$490', '$410'], correctAnswer: '$450' },
  { id: 13, topicId: 3, text: 'If SP is $240 and profit is 20%, find CP.', options: ['$180', '$200', '$210', '$220'], correctAnswer: '$200' },
  { id: 14, topicId: 3, text: 'A merchant buys 10 apples for $10 and sells 8 for $10. Find profit %.', options: ['10%', '20%', '25%', '30%'], correctAnswer: '25%' },
  { id: 15, topicId: 3, text: 'Profit is $50 on a CP of $250. Find profit %.', options: ['10%', '20%', '25%', '30%'], correctAnswer: '20%' },

  // Ratio & Proportion Questions (Topic 4)
  { id: 16, topicId: 4, text: 'Divide $120 in the ratio 1:2. What are the parts?', options: ['$40 & $80', '$30 & $90', '$50 & $70', '$60 & $60'], correctAnswer: '$40 & $80' },
  { id: 17, topicId: 4, text: 'If A:B = 2:3 and B:C = 4:5, what is A:C?', options: ['8:15', '6:15', '2:5', '4:3'], correctAnswer: '8:15' },
  { id: 18, topicId: 4, text: 'Are 2:3 and 4:6 proportional?', options: ['Yes', 'No', 'Maybe', 'Cannot determine'], correctAnswer: 'Yes' },
  { id: 19, topicId: 4, text: 'If 4:x = 12:15, find x.', options: ['3', '4', '5', '6'], correctAnswer: '5' },
  { id: 20, topicId: 4, text: 'The ratio of boys to girls is 3:2. If there are 20 girls, how many boys?', options: ['25', '30', '35', '40'], correctAnswer: '30' },

  // Time and Work Questions (Topic 5)
  { id: 21, topicId: 5, text: 'A can do work in 10 days and B in 15 days. Together they take?', options: ['5 days', '6 days', '7 days', '8 days'], correctAnswer: '6 days' },
  { id: 22, topicId: 5, text: 'If 5 men can build a wall in 10 days, how many days for 10 men?', options: ['2 days', '5 days', '8 days', '12 days'], correctAnswer: '5 days' },
  { id: 23, topicId: 5, text: 'A is twice as fast as B. If B takes 12 days, A takes?', options: ['4 days', '6 days', '8 days', '24 days'], correctAnswer: '6 days' },
  { id: 24, topicId: 5, text: 'Work done by A in 1 day is 1/5. How many days to finish?', options: ['2 days', '3 days', '4 days', '5 days'], correctAnswer: '5 days' },
  { id: 25, topicId: 5, text: 'A and B finish in 4 days. If A alone takes 12 days, B takes?', options: ['6 days', '8 days', '10 days', '12 days'], correctAnswer: '6 days' }
];

// Helper functions
export const getTopicById = (id: number): Topic | undefined => {
  return TOPICS.find(topic => topic.id === id);
};

export const getQuestionsByTopicId = (topicId: number): Question[] => {
  return QUESTIONS.filter(q => q.topicId === topicId);
};

export const getTopicsByLevel = (level: Topic['level']): Topic[] => {
  return TOPICS.filter(topic => topic.level === level);
};

// Local storage helpers for progress
const PROGRESS_KEY = 'aptitude-progress';

export const saveProgress = (topicId: number, score: number): void => {
  const stored = localStorage.getItem(PROGRESS_KEY);
  const progress: Record<number, { bestScore: number; attempts: number; completed: boolean }> = 
    stored ? JSON.parse(stored) : {};
  
  const existing = progress[topicId] || { bestScore: 0, attempts: 0, completed: false };
  progress[topicId] = {
    bestScore: Math.max(existing.bestScore, score),
    attempts: existing.attempts + 1,
    completed: true
  };
  
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
};

export const getProgress = (topicId: number): { bestScore: number; attempts: number; completed: boolean } | null => {
  const stored = localStorage.getItem(PROGRESS_KEY);
  if (!stored) return null;
  
  const progress = JSON.parse(stored);
  return progress[topicId] || null;
};

export const getAllProgress = (): Record<number, { bestScore: number; attempts: number; completed: boolean }> => {
  const stored = localStorage.getItem(PROGRESS_KEY);
  return stored ? JSON.parse(stored) : {};
};
