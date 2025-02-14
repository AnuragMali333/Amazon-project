const xhr=new XMLHttpRequest(); //create object
xhr.addEventListener('load',()=>{// runs when backend is loaded
  console.log(xhr.response);
});

xhr.open('GET','https://supersimplebackend.dev');//Parameter1= type of req Parameter2=URL
xhr.send();// send request
xhr.response