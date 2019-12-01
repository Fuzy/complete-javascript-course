/*
1. Build a function constructor called Question to describe a question. A question should include:
    a) question itself
b) the answers from which the player can choose the correct one (choose an adequate data structure here, array, object, etc.)
c) correct answer (I would use a number for this)

    2. Create a couple of questions using the constructor

3. Store them all inside an array

4. Select one random question and log it on the console, together with the possible answers (each question should have a number) (Hint: write a method for the Question objects for this task).

5. Use the 'prompt' function to ask the user for the correct answer. The user should input the number of the correct answer such as you displayed it on Task 4.

6. Check if the answer is correct and print to the console whether the answer is correct ot nor (Hint: write another method for this).

7. Suppose this code would be a plugin for other programmers to use in their code. So make sure that all your code is private and doesn't interfere with the other programmers code (Hint: we learned a special technique to do exactly that).
*/

(function () {


    function Question(question, options, correct) {
        this.question = question;
        this.options = options;
        this.correct = correct;
    }

    Question.prototype.showQuestion = function () {
        console.log(this.question);

        for (var i = 0; i < this.options.length; i++) {
            console.log(this.options[i]);
        }
    };

    Question.prototype.checkAnswer = function (option) {
        if (option === this.correct) {
            console.log('Correct!');
        } else {
            console.log('Wrong!')
        }
    };

    const q1 = 'Is google your homepage?';
    const op1 = ['yes', 'no'];
    const c1 = 0;

    const q2 = 'Are you in a good mood?';
    const op2 = ['yes', 'no'];
    const c2 = 1;

    let question1 = new Question(q1, op1, c1);
    let question2 = new Question(q2, op2, c2);

    const questions = [question1, question2];
    const random = Math.floor(Math.random() * questions.length);

    let q = questions[random];
    q.showQuestion();

    let answered = parseInt(prompt(q.question));
    console.log(answered);

    q.checkAnswer(answered);
})();


 