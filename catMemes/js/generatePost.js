fetch("./src/posts.json")
  .then(res => res.json())
  .then(data => {
    data.forEach(item => {
      const post = document.createElement("div");
      post.className = "post-masonry col-md-4 col-sm-6";
      post.innerHTML = `
        <div class="post-thumb">
          <img src="${item.img}" alt="">
          <div class="title-over">
            <h4><a href="#">${item.title}</a></h4>
          </div>
          <div class="post-hover text-center">
            <div class="inside">
              <i class="fa fa-plus"></i>
              <span class="date">${item.date}</span>
              <h4><a href="#">${item.title}</a></h4>
              <p>${item.desc}</p>
            </div>
          </div>
        </div>
      `;
      document.getElementById("post-container").appendChild(post);
    });
  });