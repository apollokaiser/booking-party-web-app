
if (document.querySelector(".jsFilter")) {
  function GetDate(date) {
    const ISODate = new Date(date);
    const year = ISODate.getFullYear();
    const month = (ISODate.getMonth() + 1).toString().padStart(2, '0');
    const day = ISODate.getDate().toString().padStart(2, '0');
    return `${day}/${month}/${year}`;
  };
  function VND(currency) {
    var formattedNumber = currency.toLocaleString('vi-VN', {
      style: 'currency',
      currency: 'VND'
    });
    return formattedNumber;
  }
  function formatPrice() {
    var inputElement = document.querySelector(".bill-bonus");
    if (inputElement.value != "") {
      var inputValue = inputElement.value.replace(/[^0-9]/g, "");
      var formattedValue = parseInt(inputValue).toLocaleString("vi-VN");
      inputElement.value = formattedValue;
    }
  }
  function exportInvoice(billID) {
    var element = document.getElementById('bill-info');
    var opt = {
      margin: 1,
      filename: `${billID}.pdf`,
      image: { type: 'jpeg', quality: 0.8 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'A5', orientation: 'landscape' }
    };
    html2pdf().set(opt).from(element).save();
    html2pdf(element, opt);
  }
  document.querySelector(".jsFilter").addEventListener("click", function () {
    document.querySelector(".filter-menu").classList.toggle("active");
  });
  let confirmStatus = document.querySelectorAll(".status");
  confirmStatus.forEach(item => {
    item.addEventListener("click", function (e) {
      const orderComponent = e.target.parentElement.parentElement;
      const deposit = orderComponent.querySelector(".deposit");
      const orderTotal = deposit.previousElementSibling;
      const percentDeposit = Number(((deposit.value * 100) / orderTotal.value).toFixed(1));
      if (deposit.value == "") {
        alert("Tiền cọc chưa được ghi nhận !")
      } else if (Number(deposit.value) > Number(orderTotal.value)) {
        alert("Số tiền cọc đã vượt quá số tiền đặt tiệc !!! ");
      } else if (percentDeposit < 10) {
        alert("tiền đặt cọc tối thiểu tương đương 10% giá trị đơn tiệc !!! ");
      } else {
        e.target.classList.toggle("active");
        e.target.classList.toggle("disabled");
        if (e.target.classList.contains("active")) {
          e.target.innerHTML = "Đã xác nhận";
        } else {
          e.target.innerHTML = "Chưa xác nhận";
        }
      }
    });
  })
  const search = document.querySelector(".search-bar");
  search.addEventListener("keydown", (e) => {
    let scope = e.target.getAttribute("id") ? e.target.getAttribute("id") : "";
    if (e.key == "Enter") {
      const filterBy = document.querySelector(".filter-items").value;
      window.location.href = `/order/search?filter=${filterBy}&data=${e.target.value}&scope=${scope}`;
    }
  });
  const confirmOrder = document.querySelector(".confirm-order");
  if (confirmOrder) {
    confirmOrder.addEventListener("click", (e) => {
      e.preventDefault();
      let orderConfirm = document.querySelectorAll(".status.active");
      if (orderConfirm.length > 0) {
        let orderIDs = [];
        orderConfirm.forEach((item) => {
          orderIDs.push({
            orderID: item.value,
            deposit: item.parentElement.parentElement.querySelector(".deposit").value
          })
        })
        const url = `/order/confirm-order`;
        fetch(url, {
          method: "POST",
          body: JSON.stringify(orderIDs),
          headers: {
            'Content-Type': 'application/json'
          },
        }).then(result => result.json())
          .then(result => {
            if (result) {
              alert("Bạn đã xác nhận thành công");
              window.location.reload();
            } else {
              alert("Đang có lỗi ! Vui lòng thử lại !!");
            }
          }).catch(err => {
            console.log("Đã có lỗi không đáng có ! Vui lòng thử lại");
          });
      } else {
        alert("Chưa đơn tiệc nào được xác nhận ! Vui lòng chọn và thử lại !");
      }
    });
  }
  const checkbox_order = document.querySelectorAll(".checkOrder");
  const deleteBtn = document.querySelector(".delete-order");
  const updateBtn = document.querySelector(".update-order");
  const createBillBtn = document.querySelector(".create-bill");
  let orderDate = "";
  const now = new Date();
  const today = GetDate(now);
  let checkbox_items = []; 
  checkbox_order.forEach(item => {
    item.addEventListener("click", (e) => {
      e.target.parentElement.parentElement.classList.toggle("selected");
      if (e.target.checked) {
        checkbox_items.push(item.value);
      } else {
        checkbox_items = checkbox_items.filter(orderID => orderID != item.value);
      }
      if (checkbox_items.length > 0) {
        deleteBtn.setAttribute("data-bs-target", "#deleteModalOrder");
        deleteBtn.setAttribute("data-bs-toggle", "modal");
        orderDate = e.target.parentElement.parentElement.querySelector(".order-date").textContent;
        if (createBillBtn && checkbox_items.length == 1 && today == orderDate) {
          createBillBtn.setAttribute("data-bs-target", "#createBill");
          createBillBtn.setAttribute("data-bs-toggle", "modal");
        } else {
          createBillBtn.removeAttribute("data-bs-target");
          createBillBtn.removeAttribute("data-bs-toggle");
        }
      } else {
        deleteBtn.removeAttribute("data-bs-target");
        deleteBtn.removeAttribute("data-bs-toggle");
        if (createBillBtn) {
          createBillBtn.removeAttribute("data-bs-target");
          createBillBtn.removeAttribute("data-bs-toggle");
        }
      }
    })
  })
  updateBtn.addEventListener("click", (e) => {
    if (checkbox_items.length > 1 || checkbox_items.length === 0) {
      alert("Vui lòng chọn 1 và chỉ 1 đơn tiệc để chỉnh sửa");
    } else {
      window.location.href = `/order/update-order/${checkbox_items[0]}`;
    }
  })
  deleteBtn.addEventListener("click", function (e) {
    e.preventDefault();
    if (!deleteBtn.getAttribute("data-bs-target")) {
      alert("Vui lòng chọn đơn hàng muốn xóa !!");
    } else {
      document.getElementById("count-delete").innerHTML = checkbox_items.length;
      const params = checkbox_items.join("-");
      document.getElementById("delete-order-confirm").addEventListener("click", (e) => {
        fetch(`/order/delete-order/${params}`)
          .then(response => response.json())
          .then(response => {
            if (response.message == "OK") {
              alert("Bạn đã xóa thành công")
              window.location.reload();
            } else {
              alert("Bạn đã xóa thất bại !");
            }
            document.querySelector(".btn-close").click();
          })
      })
    }
  })
  if (document.querySelector(".create-bill")) {
    createBillBtn.addEventListener("click", function (e) {
      e.preventDefault();
      if (checkbox_items.length > 1 || checkbox_items.length === 0) {
        alert("Vui lòng chọn 1 và chỉ 1 đơn tiệc để lập hóa đơn");
      } else if (today == orderDate) {
        const billInfo = document.querySelector('#createBill .bill-info');
        const billInfoUser = billInfo.querySelector(".bill-info-user");
        const billMenu = billInfo.querySelector(".bill-menu");
        const billPrice = billInfo.querySelector(".bill-price");
        const billBonus = billPrice.querySelector(".bill-bonus");
        const createBillConfirm = document.querySelector("#create-bill-confirm");
        fetch(`/order/get-order/${checkbox_items[0]}`)
          .then(result => result.json())
          .then(response => {
            billMenu.querySelectorAll(".food-item").forEach(element => {
              element.remove();
            });
            billInfoUser.querySelector(".order-id").innerHTML = response.order.orderID;
            billInfoUser.querySelector(".order-name").innerHTML = response.order.userName;
            billInfoUser.querySelector(".phone").innerHTML = response.order.phone;
            billInfoUser.querySelector(".info-date").innerHTML = GetDate(response.order.orderDate);
            billInfoUser.querySelector(".order-room").innerHTML = response.order.roomID;
            billPrice.querySelector(".room-price").innerHTML = VND(response.order.room.price);
            billPrice.querySelector(".deposit").innerHTML = VND(response.order.deposit);
            billPrice.querySelector(".total").innerHTML = VND(response.order.orderTotal);
            billPrice.querySelector(".bill-total").textContent = VND(response.order.orderTotal - response.order.deposit);
            response.order.detail.forEach(food => {
              let foodItem = document.createElement("div");
              foodItem.classList.add("food-item", "d-flex", "justify-content-between", "align-items-center", "col-sm-12");
              const foodName = document.createElement('div');
              foodName.classList.add("text-wrap", "col-sm-3", "text-center");
              foodName.appendChild(document.createTextNode(food.foodName));
              const quantity = document.createElement('div');
              quantity.classList.add("text-wrap", "col-sm-3", "text-center");
              quantity.appendChild(document.createTextNode(food.quantity));
              const price = document.createElement('div');
              price.classList.add("text-wrap", "col-sm-3", "text-center");
              price.appendChild(document.createTextNode(VND(food.price)));
              const total = document.createElement('div');
              total.classList.add("text-wrap", "col-sm-3", "text-center");
              total.appendChild(document.createTextNode(VND(food.price * food.quantity)));
              foodItem.appendChild(foodName);
              foodItem.appendChild(quantity);
              foodItem.appendChild(price);
              foodItem.appendChild(total);
              billMenu.appendChild(foodItem);
            });

          })
        billBonus.addEventListener("keyup", (e) => {
          const deposit = billPrice.querySelector(".deposit").textContent.replace("₫", "");
          const total = billPrice.querySelector(".total").textContent.replace("₫", "");
          const bonus = e.target.value;
          formatPrice();
          document.getElementById("bill-bonus").innerHTML = e.target.value + "<span class='text-dark'> đ</span>";
          billPrice.querySelector(".bill-total").textContent = VND(Number(bonus.replaceAll(".", "")) + Number(total.replaceAll(".", "")) - Number(deposit.replaceAll(".", "")));
        });
        createBillConfirm.addEventListener("click", (e) => {
          e.preventDefault();
          const bill = {
            billID: new Date().getTime(),
            orderID: billInfoUser.querySelector(".order-id").innerHTML,
            billTotal: billPrice.querySelector(".bill-total").textContent.replace("₫", "").replaceAll(".", ""),
            billBonus: billBonus.value.replaceAll(".", ""),
            billDate: new Date(),
          }
          fetch("/bill/add-bill", {
            method: "POST",
            body: JSON.stringify(bill),
            headers: {
              'Content-Type': 'application/json'
            },
          }).then(response => response.json())
            .then(response => {
              if (response.success == true) {
                alert("Lưu hóa đơn thành công !!!");
                billBonus.style.display = "none";
                document.getElementById("bill-bonus").style.display = "inline-block";
                document.querySelector(".close-create-bill").click();
                checkbox_order.forEach(checkbox =>{
                  if(checkbox.checked){
                    checkbox.parentElement.parentElement.remove();
                  }
                })
                exportInvoice(bill.billID);
              } else {
                console.log(response);
                alert("Lưu hóa đơn không thành công !! Vui lòng thử lại ");
              }
            }).catch(error => {
              console.log(error);
              alert("Hóa đơn không hợp lệ !!");
            })
        })

      } else {
        alert("Không thể lập hóa đơn vào hôm nay ! Trân trọng !!");
      }
    });
  }
} else {
  document.querySelector(".reload-bar").addEventListener("click", function (e) {
    e.preventDefault();
    window.location.href = "/order/get-pending-order";
  })

}