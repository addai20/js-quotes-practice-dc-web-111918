// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.

document.addEventListener("DOMContentLoaded", ()=> {
  console.log("DOM successfully loaded");

  getQuotes();
  document.addEventListener("submit", () =>{
    newQuote()
  })

})

function getQuotes(){

  fetch('http://localhost:3000/quotes')
    .then(function(response) {
      return response.json();
    })
    .then(function(allQuotes) {
      console.log(allQuotes)

      allQuotes.map(quote=> renderQuote(quote))
    })
}

function newQuote(){
  let formData = document.getElementById('new-quote-form')
    let quoteText = formData[0].value
    let author = formData[1].value
    let id = document.getElementById('quote-list').children.length + 1

    let data = {
      id: id,
      quote: quoteText,
      likes: 0,
      author: author
    }

  fetch(`http://localhost:3000/quotes`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers:{
        'Content-Type': 'application/json'
    }
  }).then(res => res.json())
  .then(response => console.log('Success:', JSON.stringify(response)))
  .catch(error => console.error('Error:', error));
}

function deleteQuote(){
  console.log("delete button pressed");
  let key = event.target.key

  debugger

  //Below fetch is not functional, will complete after post is created

  fetch(`http://localhost:3000/quotes/${key}`, {
    headers: {
      'Accept': 'application/json'
    },
    method: 'DELETE',
    body: JSON.stringify( {id: key})
  })


}

function incrementLikes(){
  //       // The below solution updates the like button but does not persist in the DB
  //
  //   //grab like button's <span>
  // let currentLikes = event.target.firstElementChild
  //
  //   // extract the string value of like button's innerText
  // let innerText = currentLikes.innerText
  //
  //   //use parseInt to convert string value of innerText to an integer
  //   //use string interpolation to increment like button
  // currentLikes.innerText = parseInt(currentLikes.innerText) + 1
  //
  //   // currentLikes.innerText
  //   // parseInt(event.target.firstElementChild.innerText)
  //
  //   //set its innerText = innerText + 1
  // console.log("like button clicked")
  //   // debugger
  //
  // fetch(`http://localhost:3000/quotes`)
  //   .then()

  // The following soltion is more ideal as it updates the database...
  // using a patch and it displays the update without needing a refresh!

  //Get id of the quote

  //locate the key of the li quote
  let key = event.target.parentElement.parentElement.key

  // integer value of like count
  let currentLikes = parseInt(event.target.firstElementChild.innerText)

  //<span/>
  let likeCountSpan = event.target.firstElementChild

  //updates front end
  likeCountSpan.innerText = currentLikes + 1

  // currentLikes.innerText = "testing"

  debugger

  fetch(`http://localhost:3000/quotes/${key}`, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'PATCH',
    body: JSON.stringify( {likes: currentLikes + 1})
  })


}

function renderQuote(quoteObj){
  let quoteContainer = document.getElementById("quote-list")

    let li = document.createElement("li")
    li.classList.add("quote-card")
    li.key = quoteObj.id
      let blockquote = document.createElement('blockquote')
      blockquote.classList.add('blockquote')

        let p = document.createElement('p')
        p.classList.add('mb-0')
        p.innerText = quoteObj.quote

        let footer = document.createElement('footer')
        footer.classList.add('blockquote-footer')

        let br = document.createElement('br')

        let likeBtn = document.createElement('button')
        likeBtn.classList.add('btn-success')
        likeBtn.innerText = "Likes:"
        likeBtn.addEventListener("click", (e)=> {
          incrementLikes()
        })


          let span = document.createElement('span')
          span.innerText = quoteObj.likes
            likeBtn.appendChild(span)

        let delBtn = document.createElement('button')
        delBtn.classList.add('btn-danger')
        delBtn.innerText = "Delete"
        delBtn.key = quoteObj.id
        delBtn.addEventListener('click', ()=> {
          deleteQuote()
        })

        quoteContainer.appendChild(li)
        li.appendChild(blockquote)
        blockquote.append(p, footer, br, likeBtn, delBtn)
}
