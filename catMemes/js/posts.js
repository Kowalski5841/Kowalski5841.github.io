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
document.addEventListener("DOMContentLoaded", function () {
    const searchBtn = document.getElementById("searchBtn");
    const searchInput =document.getElementById("searchInput");
    function searchAndHighLight () {
        const keyword = searchInput.value.trim().toLowerCase();
        if (!keyword) return;
        const cards = document.querySelectorAll(".post-masonry");
        let found = false;
        cards.forEach(card =>{
            const title = card.querySelector(".title-over h4 a")
                ?.textContent.toLowerCase()||"";
/*            const desc = card.querySelector(".inside p")
                ?.textContent.toLowerCase()||"";*/
            if (title.includes(keyword) /*|| desc.includes(keyword)*/) {
                found = true;
                // 滚动过去
                card.scrollIntoView({behavior:"smooth",block:"center"});
                // 高亮
                const postThumb = card.querySelector(".post-thumb");
                let count = 0;
                const interval = setInterval(() => {
                    if (count % 2 === 0) {
                        postThumb.style.border = "10px solid yellow";
                    } else {
                        postThumb.style.border = "";
                    }
                    count++;
                    if (count > 5) {
                        clearInterval(interval);
                    }
                }, 300); // 每 200ms 闪一下
            }
        });
        if (!found) {
            const notice = document.createElement("div");
            notice.textContent = "没有找到匹配的小猫呢~ 😿";
            notice.style.position = "fixed";
            notice.style.top = "20px";
            notice.style.right = "-300px"; // 初始在屏幕外
            notice.style.background = "rgba(255, 223, 186, 0.95)";
            notice.style.color = "#000";
            notice.style.padding = "10px 15px";
            notice.style.borderRadius = "10px";
            notice.style.boxShadow = "0 0 10px rgba(0,0,0,0.2)";
            notice.style.zIndex = "9999";
            notice.style.transition = "right 0.5s ease-out"; // 动画走起~
            document.body.appendChild(notice);

            // 飞进来喵～
            setTimeout(() => {
                notice.style.right = "20px";
            }, 10);

            // 停留一会儿，再飞出去～
            setTimeout(() => {
                notice.style.right = "-300px";
            }, 2000);

            // 移除元素
            setTimeout(() => {
                notice.remove();
            }, 2500);
        }

    }
    searchBtn.addEventListener("click", function (e) {
        e.preventDefault();
        searchAndHighLight();
    });
    searchInput.addEventListener("Keydown", function (e) {
        if (e.key === "Enter") {
            e.preventDefault();
            searchAndHighLight();
        }
    });
});