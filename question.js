const questions = [
    {
      question: 'When he was ten his father split, full of it, debt-ridden. Two years later, see Alex and his mother bed-ridden. Half-dead sittin\' in their own sick, the scent thick',
      options: [{name: 'Aaron Burr', correct: false}, {name: 'James Madison', correct: false}, {name: 'John Laurens', correct: false}, {name: 'Eliza Hamilton', correct: true}],
      answer: 'Eliza Hamilton'
    },
    {
      question: 'I am sailing off to London. I’m accompanied by someone who always pays. I have found a wealthy husband. Who will keep me in comfort for all my days. He is not a lot of fun, but there’s no one',
      options: [{name: 'Eliza', correct: false}, {name: 'Peggy', correct: false}, {name: 'Angelica', correct: true}, {name: 'Maria', correct: false}],
      answer: 'Angelica'
    },
    {
      question: 'Lord, show me how to. Say no to this. I don’t know how to. Say no to this',
      options: [{name: 'Alexander Hamilton', correct: true}, {name: 'Thomas Jefferson', correct: false}, {name: 'John Laurens', correct: false}, {name: 'James Madison', correct: false}],
      answer: 'Alexander Hamilton'
    },
    {
      question: 'And y’all look pretty good in ya’ frocks. How ‘bout when I get back, we all strip down to our socks?',
      options: [{name: 'Philip Hamilton', correct: true}, {name: 'George Eacker', correct: false}, {name: 'John Adams', correct: false}, {name: 'John Adams', correct: false}],
      answer: 'Philip Hamilton'
    },
    {
      question: 'And when you said “Hi,” I forgot my dang name',
      options: [{name: 'Maria', correct: false}, {name: 'Eliza', correct: false}, {name: 'Peggy', correct: false}, {name: 'Angelica', correct: true}],
      answer: 'Angelica'
    },
    {
      question: 'Thank you for all your service',
      options: [{name: 'Eliza', correct: true}, {name: 'Maria', correct: false}, {name: 'Peggy', correct: false}, {name: 'Angelica', correct: false}],
      answer: 'Eliza'
    },
    {
      question: 'And I’m never gonna stop until I make ‘em. Drop and burn ‘em up and scatter their remains, I’m',
      options: [{ name: 'Lafayette', correct: true }, { name: 'Laurens', correct: false }, { name: 'Eacker', correct: false }, {name: 'Adams', correct: false}],
      answer: 'Lafayette'
    },
    {
      question: 'Yeah, you know what? We can change that. You know why?',
      options: [{name: 'Jefferson', correct: true}, {name: 'Maria', correct: false}, {name: 'Peggy', correct: false}, {name: 'Angelica', correct: false}],
      answer: 'Jefferson'
    },
    {
      question: 'I survived, but I paid for it',
      options: [{name: 'Aaron Burr', correct: true}, {name: 'James Madison', correct: false}, {name: 'George Washington', correct: false}, {name: 'King George', correct: false}],
      answer: 'Aaron Burr'
    },
    {
      question: 'When you knock me down I get the fuck back up again!',
      options: [{name: 'Burr', correct: false}, {name: 'Lafayette', correct: false}, {name: 'Mulligan', correct: true}, {name: 'Laurens', correct: false}],
      answer: 'Mulligan'
    },
    {
      question: 'Why so sad? Remember we made an arrangement when you went away.Now you’re making me mad',
      options: [{name: 'Peggy Schuyler', correct: false}, {name: 'King George', correct: true}, {name: 'Eliza Hamilton', correct: false}, {name: 'Angelica Schuyler', correct: false}],
      answer: 'King George'
    },
    {
      question: 'It’s bad enough daddy wants to go to war',
      options: [{name: 'Peggy Schuyler', correct: true}, {name: 'King George', correct: false}, {name: 'Angelica Schuyler', correct: false}, {name: 'Eliza Hamilton', correct: false}],
      answer: 'Peggy Schuyler'
    },
    {
      question: 'When I was given my first command. I led my men straight into a massacre',
      options: [{name: 'John Adams', correct: false}, {name: 'James Madison', correct: false}, {name: 'John Laurens', correct: false}, {name: 'George Washington', correct: true}],
      answer: 'George Washington'
    },
    {
      question: 'Black and white soldiers wonder alike if this really means freedom',
      options: [{name: 'Burr', correct: false}, {name: 'Lafayette', correct: false}, {name: 'Mulligan', correct: false}, {name: 'Laurens', correct: true}],
      answer: 'Laurens'
    },
    {
      question: 'We lower our guns as he frantically waves a white handkerchief',
      options: [{name: 'Lafayette', correct: true}, {name: 'Burr', correct: false}, {name: 'Mulligan', correct: false}, {name: 'Laurens', correct: false}],
      answer: 'Lafayette'
    },
    {
      question: 'And so the American experiment begins. With my friends all scattered to the winds',
      options: [{name: 'Hamilton', correct: true}, {name: 'Lafayette', correct: false}, {name: 'Mulligan', correct: false}, {name: 'Laurens', correct: false}],
      answer: 'Hamilton'
    },
    {
      question: 'We will fight up close, seize the moment and stay in it. It’s either that or meet the business end of a bayonet. The code word is ‘Rochambeau,’ dig me?',
      options: [{name: 'Hamilton', correct: true}, {name: 'Lafayette', correct: false}, {name: 'Mulligan', correct: false}, {name: 'Jefferson', correct: false}],
      answer: 'Hamilton'
    },
    {
      question: 'An immigrant you know and love who’s unafraid to step in!',
      options: [{name: 'Burr', correct: true}, {name: 'Laurens', correct: false}, {name: 'Washington', correct: false}, {name: 'Mulligan', correct: false}],
      answer: 'Burr'
    },
    {
      question: 'I’m a trust fund, baby, you can trust me!',
      options: [{name: 'Burr', correct: true}, {name: 'Lafayette', correct: false}, {name: 'George', correct: false}, {name: 'Laurens', correct: false}],
      answer: 'Burr'
    },
    {
      question: 'You want a revolution? I want a revelation',
      options: [{name: 'Angelica', correct: true}, {name: 'Eliza', correct: false}, {name: 'Mulligan', correct: false}, {name: 'Laurens', correct: false}],
      answer: 'Angelica'
    },
    {
      question: 'You punched the bursar',
      options: [{name: 'Lafayette', correct: false}, {name: 'Peggy', correct: false}, {name: 'Laurens', correct: false}, {name: 'Burr', correct: true}],
      answer: 'Burr'
    }
  ]


  module.exports = questions;

