// let john = {
//     name: 'John',
//     yearOfBirth: 1990,
//     job: 'teacher'
// };

// let Person = function (name, yearOfBirth, job) {
//   this.name = name;
//   this.yearOfBirth = yearOfBirth;
//   this.job = job;
// };
//
// Person.prototype.calculateAge = function () {
//     console.log(2016 - this.yearOfBirth);
// };
//
// Person.prototype.lastName = "Smith";
//
// let john = new Person('John', 1990, 'teacher');
// let jane = new Person('Jane', 1969, 'designer');
// let mark = new Person('mark', 1948, 'retired');
//
//
// john.calculateAge();
// jane.calculateAge();
// mark.calculateAge();
//
//
// console.log(john.lastName);
// console.log(jane.lastName);
// console.log(mark.lastName);

//object.create
//
// let personProto = {
//     calculateAge: function () {
//         console.log(2016 - yearOfBirth);
//     }
// };
//
// let john = Object.create(personProto);
// john.name = "john";
// john.yearOfBirth = 1990;
// john.job = "t";
//
// let jane = Object.create(personProto, {
//     name: {value: "jane"},
//     yearOfBirth: {value: 1969},
//     job: {value: 't'}
// });

// prim vs objects

// let a = 23;
// let b = a;
// a = 46;
// console.log(a, b);
//
// let obj1 = {
//     name: 'john',
//     age: 26
// };
//
// let obj2 = obj1;
// obj1.age = 30;
//
// console.log(obj1, obj2);
//
//
// let age = 27;
// let obj = {
//   name: 'john',
//   city: 'Town'
// };
//
// function change(a,b) {
//     a = 30;
//     b.city = "san Francisco";
// }
//
// change(age, obj);
// console.log(age, obj.city);

// let years = [1990, 1965, 1937, 2005, 1998];
//
// function arrayCalc(arr, fn) {
//     let arrRes = [];
//     for (let i = 0; i < arr.length; i++) {
//         arrRes.push(fn(arr[i]));
//     }
//     return arrRes;
// }
//
// function calculateAge(el) {
//     return 2016 - el;
// }
//
// function isFullAge(el) {
//     return el >= 18;
// }
//
// function maxHeartRate(el) {
//
//     if (el>=18 && el <= 81) {
//         return Math.round(206.9 - (0.67 * el));
//     } else {
//         return -1;
//     }
// }
//
// let ages = arrayCalc(years, calculateAge);
// let fullAge = arrayCalc(ages, isFullAge);
// let rates = arrayCalc(ages, maxHeartRate);
//
//
// console.log(ages);
// console.log(fullAge);
// console.log(rates);


// function interviewQuestion(job) {
//     if (job === 'designer') {
//         return function (name) {
//             console.log(name + ", can you explain?");
//         }
//     } else if (job === 'teacher') {
//         return function (name) {
//             console.log(name + ", subject?");
//         }
//     } else {
//         return function (name) {
//             console.log(name + ', type');
//         }
//     }
// }
//
// let teacherQuestion = interviewQuestion('teacher');
//
//
// teacherQuestion('John');
//
// interviewQuestion('teacher')("roman");


//
// function game() {
//     let score = Math.random() * 10;
//     console.log(score >= 5);
// }
//
// game();


//
// (function (goodLuck) {
//     let score = Math.random() * 10;
//     console.log(score >= 5 - goodLuck);
// })(5);

// function retirement(retirementAge) {
//     let a = ' years left.';
//     return function (yearOfBirth) {
//         let age = 2016 - yearOfBirth;
//         console.log((retirementAge - age) + a);
//     }
// }
//
// let retiremnetUS = retirement(66);
//
// retiremnetUS(1990);
//
//
// retirement(66)(1990);

//
// let john = {
//   name: 'John',
//   age: 26,
//   job: 'teacher',
//   presentation: function (style, timeOfDay) {
//       if (style === 'formal') {
//           console.log('something ' + timeOfDay + this.name + this.job + this.age);
//       } else if (style === 'friendly') {
//           console.log('something 1' + timeOfDay + this.name + this.job + this.age);
//       }
//   }
// };
//
// let emily = {
//     name: 'emily',
//     age: 35,
//     job: 'designer',
// };
//
// john.presentation('formal', 'morning');
// john.presentation.call(emily, 'friendly', 'evening');
//
// john.presentation.apply(emily, ['friendly', 'evening']);
//
//
// let johnFriendly = john.presentation.bind(john, 'friendly');
//
//
// johnFriendly('morning');

//
// let years = [1990, 1965, 1937, 2005, 1998];
//
// function arrayCalc(arr, fn) {
//     let arrRes = [];
//     for (let i = 0; i < arr.length; i++) {
//         arrRes.push(fn(arr[i]));
//     }
//     return arrRes;
// }
//
// function calculateAge(el) {
//     return 2016 - el;
// }
//
// function isFullAge(limit, el) {
//     return el >= limit;
// }
//
//
// let ages = arrayCalc(years, calculateAge);
// let fullJapan = arrayCalc(ages, isFullAge.bind(this, 20));
//
// console.log(ages);
// console.log(fullJapan);


// (function () {
//     function Question(question, answers, correct) {
//         this.question = question;
//         this.answers = answers;
//         this.correct = correct;
//     }
//
//     Question.prototype.displayQuestion = function () {
//         console.log(this.question);
//
//         for (let i = 0; i < this.answers.length; i++) {
//             console.log(i + " " + this.answers[i]);
//         }
//     };
//
//     Question.prototype.checkAnswer = function (ans) {
//         if (ans === this.correct) {
//             console.log('correct');
//         } else {
//             console.log('nope');
//         }
//     };
//
//     let q1 = new Question('Is js good?', ['yes', 'no'], 0);
//     let q2 = new Question('Is this name good?', ['yes', 'no'], 1);
//     let q3 = new Question('What are those?', ['yes', 'no', 'I don\'n know?'], 2);
//
//     let questions = [q1, q2, q3];
//     let n = Math.floor(Math.random() * questions.length);
//
//     questions[n].displayQuestion();
//
//     let answer = parseInt(prompt('answers'));
//
//     questions[n].checkAnswer(answer);
// })();





















