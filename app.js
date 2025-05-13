
const productSlides = document.getElementById("slidesContainer");
const productCount = document.getElementById("product-count");
const productPrice = document.getElementById("product-price");
const deliveryCharge = document.getElementById("delivery-charge");
const tax = document.getElementById("tax");
const shippingCost = document.getElementById("shipping-cost");
const totalPrice = document.getElementById("total-price");

let cart = [];

function updateCart() {
  let count = cart.length;
  let price = cart.reduce((sum, p) => sum + p.price, 0);
  let delivery = price * 0.02;
  let taxAmount = price * 0.25;
  let shipping = price * 0.01;
  let total = price + delivery + taxAmount + shipping;

  productCount.textContent = count;
  productPrice.textContent = price.toFixed(2);
  deliveryCharge.textContent = delivery.toFixed(2);
  tax.textContent = taxAmount.toFixed(2);
  shippingCost.textContent = shipping.toFixed(2);
  totalPrice.textContent = total.toFixed(2);
}

function createProductCard(product, reviews) {
  const card = document.createElement("div");
  card.className = "bg-gray-300 p-4 rounded-lg shadow-lg flex flex-col gap-2 w-80 hover:scale-105 transition-transform duration-300";
  card.innerHTML = `
    <img src="${product.image}" class="w-full h-40 object-cover rounded-md"/>
    <h3 class="font-bold text-lg">${product.name}</h3>
    <p class="text-sm text-gray-500">Brand: ${product.brand}</p>
    <p class="text-blue-600 font-semibold">$${product.price}</p>
    <p class="text-sm">${product.description}</p>
    <div class="rating flex gap-1 text-yellow-500 text-sm"></div>

    <div class="flex gap-2">
      <button class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded add-btn">Add to Cart</button>
      <button class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded remove-btn">Remove</button>
      <button class="bg-teal-800 hover:bg-blue-600 text-white px-3 py-1 rounded review-btn">Reviews</button>
    </div>
    <div class="review-container hidden mt-2 text-sm text-gray-700"></div>
  `;








  // Dynamically render rating stars
  const ratingDiv = card.querySelector(".rating");
  const fullStars = Math.floor(product.rating);
  const hasHalfStar = product.rating % 1 >= 0.5;

  // Add full stars
  for (let i = 0; i < fullStars; i++) {
    const star = document.createElement("span");
    star.textContent = "★";
    ratingDiv.appendChild(star);
  }

  // Add half star if needed
  if (hasHalfStar) {
    const halfStar = document.createElement("span");
    halfStar.textContent = "⯨"; // You can use "☆", or emoji "⭐" with opacity 0.5 as fallback
    ratingDiv.appendChild(halfStar);
  }














  const addBtn = card.querySelector(".add-btn");
  const removeBtn = card.querySelector(".remove-btn");
  const reviewBtn = card.querySelector(".review-btn");
  const reviewContainer = card.querySelector(".review-container");
  const discountBtn = document.getElementById("discount-btn");
  const discountedTotal = document.getElementById("discounted-total");
  const discountValue = document.getElementById("discount-value");
  const orderBtn = document.getElementById("order-btn");
  discountBtn.onclick = () => {
    let price = cart.reduce((sum, p) => sum + p.price, 0);
    const delivery = Math.round(price * 0.02);
    const taxAmount = Math.round(price * 0.25);
    const shipping = Math.round(price * 0.01);
    const totalAmount = price + delivery + taxAmount + shipping;

    if (totalAmount >= 1000000) {
      const discounted = Math.round(totalAmount * 0.9);
      discountValue.textContent = `${discounted}`;
      discountedTotal.classList.remove("hidden");
    } else {
      alert("Discount only applies if total is 1,000,000 or more.");
    }
  };


  orderBtn.onclick = () => {
    let price = cart.reduce((sum, p) => sum + p.price, 0);
    const delivery = Math.round(price * 0.02);
    const taxAmount = Math.round(price * 0.25);
    const shipping = Math.round(price * 0.01);
    const totalAmount = price + delivery + taxAmount + shipping;

    let finalAmount = totalAmount;

    if (totalAmount >= 1000000 && !discountedTotal.classList.contains("hidden")) {
      finalAmount = Math.round(totalAmount * 0.9); // Apply 10% discount
    }

    alert(`Your order has been placed successfully! Total amount: $${ finalAmount }`);

    cart = [];
    updateCart();
    discountedTotal.classList.add("hidden"); // hide discount section after order
  };




  addBtn.onclick = () => {
    cart.push(product);
    updateCart();
  };

  removeBtn.onclick = () => {
    let idx = cart.findIndex(p => p.id === product.id);
    if (idx !== -1) {
      cart.splice(idx, 1);
      updateCart();
    }
  };









  reviewBtn.onclick = () => {
    product.showReview = !product.showReview;
    if (product.showReview) {
      reviewContainer.classList.remove("hidden");
      reviewContainer.innerHTML = reviews
        .slice(0, 2)
        .map(r => `
        <div class="flex items-start gap-2 mb-2">
          <img src="${r.image}" alt="${r.name}" class="w-10 h-10 rounded-full object-cover"/>
          <div>
            <p class="text-sm text-gray-700">"${r.review}"</p>
            <p class="text-xs font-semibold text-gray-600">- ${r.name}</p>
          </div>
        </div>
      `)
        .join("");
    } else {
      reviewContainer.classList.add("hidden");
      reviewContainer.innerHTML = '';
    }
  };

  return card;
}


async function fetchData() {
  const [productRes, reviewRes] = await Promise.all([
    fetch("https://yunusarfat.github.io/api_hosting/carDetails.json"),
    fetch("https://yunusarfat.github.io/api_hosting/reviewDetails.json")
  ]);
  const products = await productRes.json();
  const reviews = await reviewRes.json();

  const slidesPerView = 2;
  const totalSlides = Math.ceil(products.length / slidesPerView);

  for (let i = 0; i < totalSlides; i++) {
    const slideWrapper = document.createElement("div");
    slideWrapper.className = "w-full flex flex-col items-center mb-6";

    const slide = document.createElement("div");
    slide.className = "flex transition-all ease-in-out duration-500 gap-4 overflow-hidden w-[70%]";

    let index = i; // separate index for each section

    const renderSlide = () => {
      slide.innerHTML = "";
      const start = index * slidesPerView;
      const view = products.slice(start, start + slidesPerView);

      view.forEach((p, i) => {
        // attach a showReview flag to maintain state
        if (p.showReview === undefined) p.showReview = false;

        const card = createProductCard(p, reviews);
        slide.appendChild(card);
      });


      while (slide.children.length < slidesPerView) {
        const filler = document.createElement("div");
        filler.className = "w-80";
        slide.appendChild(filler);
      }
    };

    renderSlide();

    const controls = document.createElement("div");
    controls.className = "flex gap-4 mt-2";

    const prevBtn = document.createElement("button");
    prevBtn.className = "px-3 py-1 rounded bg-gray-800 text-white hover:bg-gray-700";
    prevBtn.textContent = "<";
    prevBtn.onclick = () => {
      if (index > 0) {
        index--;
        renderSlide();
      }
    };

    const nextBtn = document.createElement("button");
    nextBtn.className = "px-3 py-1 rounded bg-gray-800 text-white hover:bg-gray-700";
    nextBtn.textContent = ">";
    nextBtn.onclick = () => {
      if ((index + 1) * slidesPerView < products.length) {
        index++;
        renderSlide();
      }
    };

    controls.appendChild(prevBtn);
    controls.appendChild(nextBtn);

    slideWrapper.appendChild(slide);
    slideWrapper.appendChild(controls);

    productSlides.appendChild(slideWrapper);
  }
}


fetchData();