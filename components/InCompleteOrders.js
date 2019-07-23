import React from "react";

class InCompleteOrders extends React.Component {
  render() {
    return (
      <div
        class="row justify-content-center p-4"
        id="incomplete_orders_section"
      >
        <div className="border-card pt-4 mb-4">
          <div class="row justify-content-between align-items-center">
            <div class="col-md-7 col-12">
              <div class="img-desc mb-4 mb-md-0">
                <div class="col-md-3 col-4">
                  <img className="round" src={this.props.image} alt="" />
                </div>
                <div class="description justify-content-center">
                  <div>
                    <h4>{this.props.product_name}</h4>
                    <div class="grey font-sm">Some Description</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="row no-gutters justify-content-between font-mds red extra-bold">
                <div>Order Total</div>
                <div class="font-md">₹ {this.props.amount}</div>
              </div>
              <div class="font-sm grey">
                Purchased on {this.props.created_at.toString()}
              </div>
            </div>
          </div>

          <div class="extra-bold mt-4">
            <span class="font-mds red">Remaining Balance</span>
            <span class="font-md ml-4 red"> ₹ {this.props.amount}</span>
          </div>

          <div class="divider-h mt-4 mb-4" />
          {/* <input type="hidden" id="CartId" name="cartId" value={{payment.cart_id}}> */}

          <div class="row">
            <a
              href={`/admin/PartialHistory?userid=${
                this.props.userid
              }&cart_id=${this.props.cart_id}`}
              class="button-solid view-partial-payment"
            >
              View all Transactions
            </a>

            <a
              href={`/admin/ContinuePayment?id=${this.props.cart_id}&userid=${
                this.props.userid
              }`}
              target="blank"
              class="button-solid"
              style={{ marginLeft: "10vh" }}
            >
              Continue
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default InCompleteOrders;
