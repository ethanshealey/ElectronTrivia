window.addEventListener('DOMContentLoaded', () => {
    let url = 'https://opentdb.com/api.php?amount=1';

    function shuffle(arr) {
      var j, x, index;

      for(index = arr.length - 1; index > 0; index--) {
        j = Math.floor(Math.random() * (index + 1));
        x = arr[index];
        arr[index] = arr[j];
        arr[j] = x;
      }

      return arr;
    }

    function remove_answer(e) {
      e.parentNode.removeChild(e);
    }

    function unescapeHtml(unsafe) {
      return unsafe
           .replace(/&amp;/g, "&")
           .replace(/&lt;/g, "<")
           .replace(/&gt;/g, ">")
           .replace(/&quot;/g, "\"")
           .replace(/&#039;/g, "'");
   }

    fetch(url).then(res => res.json()).then((out) => {
      console.log(out);
      var question = unescape(unescapeHtml(out.results[0].question));
      var cat = unescape(unescapeHtml(out.results[0].category));
      var diff = unescape(unescapeHtml(out.results[0].difficulty[0].toUpperCase())) + unescape(unescapeHtml(out.results[0].difficulty.slice(1)));
      var correct = unescape(unescapeHtml(out.results[0].correct_answer));
      var incorrect = out.results[0].incorrect_answers;
      var type = unescape(unescapeHtml(out.results[0].type));
      incorrect.push(correct);
       
      for(let i = 0; i < incorrect.length; i++) {
        incorrect[i] = unescape(unescapeHtml(incorrect[i]));
      }

      console.log(incorrect)

      if(type == "boolean") {
        let x = incorrect[0];
        if(x == "False") {
          incorrect[0] = incorrect[1];
          incorrect[1] = x;
        }

        remove_answer(document.getElementById('answer-3'));
        remove_answer(document.getElementById('answer-4'));
        var answers = ['1', '2']
      }
      else {
        incorrect = shuffle(incorrect);
        document.getElementById('answer-3').innerHTML = incorrect[2];
        document.getElementById('answer-4').innerHTML = incorrect[3];
        var answers = ['1', '2', '3', '4']
      }

      document.getElementById('question').innerHTML = question;
      document.getElementById('category').innerHTML = 'Category: ' + cat;
      document.getElementById('difficulty').innerHTML = 'Difficulty: <span class="' + diff + '">' + diff + "</span>";
      document.getElementById('answer-1').innerHTML = incorrect[0];
      document.getElementById('answer-2').innerHTML = incorrect[1];

      for(answer in answers) {
        document.getElementById('answer-' + answers[answer]).onclick = (e) => {
          for(a in answers) {
            let x = document.getElementById('answer-' + answers[a]);
            document.getElementById('results-container').style.visibility = 'visible';
            console.log(x.innerHTML)
            if(x.innerHTML == correct) {
              x.classList.remove('btn-hover')
              x.style.backgroundColor = 'green';
              //document.getElementById('results').innerHTML = 'Good job! You chose the correct answer!';
            }
            else {
              x.classList.remove('btn-hover')
              x.style.backgroundColor = 'red';
              //document.getElementById('results').innerHTML = 'Sorry! The correct answer was "' + correct + '"!';
            }
          }
          var chosen = e.srcElement.innerHTML;
          console.log(correct);
          if(chosen == correct) {
            document.getElementById('results').innerHTML = 'Good job! You got the correct answer!';
          }
          else {
            document.getElementById('results').innerHTML = 'Sorry! The correct answer was "' + correct + '"!';
          }
          document.getElementById('results').innerHTML += '<br><br><button class="btn btn-clear btn-hover" onclick="location.reload()">Next Question!</button>'
        }
      }

    }).catch(err => {throw err});
  })