import React from "react";
import Link from "next/link";
import Cookies from 'js-cookie'
import jwt from "jsonwebtoken";
import config from "../config";

class Layout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "Guest",
      pic: "../static/img/guest-user.jpg",
      loggedIn: false,
      admin: false
    };
  }

  componentDidMount() {
    const dukaanToken = Cookies.get("dukaan-token");
    if (dukaanToken) {
      const userInfo = jwt.decode(dukaanToken);
      this.setState({
        name: userInfo.data.firstname + " " + userInfo.data.lastname,
        center_id: userInfo.data.center_id,
        pic: userInfo.data.photo,
        loggedIn: true,
        admin: userInfo.data.role === "admin" || userInfo.data.role === "staff",
        finance_manager: userInfo.data.role === "finance_manager"
      });
    }
  }

  render() {
    return (
      <div>
        <nav className="main-nav">
          <div className="nav-left">
            <span className="hamburger-parent">
              <i className="hamburger fas fa-bars" />
            </span>
            <span className="logo-parent">
              <Link href="/">
                <a className="logo-link">
                  <img
                    src="/static/img/dukaan.png"
                    className="nav-logo pointer"
                  />
                </a>
              </Link>
            </span>
          </div>

          <div className="dsp-none-sm justify-content-center">
            <div className="nav-right">
              <ul className="nav-list">
                {this.state.loggedIn && (this.state.admin ||
                    this.state.finance_manager || this.state.staff) && (
                <div>
                    <li>
                        <Link href="/admin/report">
                         <a> Report </a>
                        </Link>
                    </li>
                 </div>
                )}
                {this.state.loggedIn && this.state.admin && (
                  <div>

                    <li className="dropdown">
                      <button className="dropbtn dropdown-toggle">
                        Payments
                        <i className="fa fa-caret-down pl-2" />
                      </button>
                      <div className="dropdown-content">
                        <div className="flex-row justify-content-center">
                          <Link href="/admin/payments">
                            <a>Capture Manual</a>
                          </Link>
                        </div>
                      </div>
                    </li>

                    <li className="dropdown">
                      <button className="dropbtn dropdown-toggle">
                        Coupons
                        <i className="fa fa-caret-down pl-2" />
                      </button>
                      <div className="dropdown-content">
                        <div className="flex-row justify-content-center">
                          <Link href="/admin/coupons2">
                            <a>All</a>
                          </Link>
                        </div>
                        <div className="divider-h" />
                        <div className="flex-row justify-content-center">
                          <Link href="/admin/coupons2/add">
                            <a>Add New</a>
                          </Link>
                        </div>
                        <div className="divider-h" />
                        <div className="flex-row justify-content-center">
                          <Link href="/admin/coupons2/bulk">
                            <a>Add Bulk</a>
                          </Link>
                        </div>
                      </div>

                    </li>

                    <li className="dropdown">
                      <button className="dropbtn dropdown-toggle">
                        Products
                        <i className="fa fa-caret-down pl-2" />
                      </button>
                      <div className="dropdown-content">
                        <div className="flex-row justify-content-center">
                          <Link href="/admin/products">
                            <a>All</a>
                          </Link>
                        </div>
                        <div className="divider-h" />
                        <div className="flex-row justify-content-center">
                          <Link href="/admin/products/add">
                            <a>Add New</a>
                          </Link>
                        </div>
                      </div>
                    </li>

                    <li className="dropdown">
                      <button className="dropbtn dropdown-toggle">
                        Buy Links
                        <i className="fa fa-caret-down pl-2" />
                      </button>
                      <div className="dropdown-content">
                        <div className="flex-row justify-content-center">
                          <Link href="/admin/buyLinks">
                            <a>All</a>
                          </Link>
                        </div>
                        <div className="divider-h" />
                        <div className="flex-row justify-content-center">
                          <Link href="/admin/buyLinks/add">
                            <a>Add New</a>
                          </Link>
                        </div>
                      </div>
                    </li>

                    {this.state.loggedIn && this.state.admin  && (
                      
                      <li class="ml-4">
                          <Link href="/admin/reconcile">
                          <a> Reconcile </a>
                          </Link>
                      </li>
                      
                    )}

                  </div>
                )}
                <li className="nav-items pointer capitalize">
                  <img
                    src={this.state.pic}
                    className={"pic"}
                    width={48}
                    height={48}
                    align={"absmiddle"}
                  />
                  <Link href="https://account.codingblocks.com">
                    <a className="active name">Hi, {this.state.name}</a>
                  </Link>
                </li>
                {this.state.loggedIn && (
                  <li className="nav-items pointer">
                    <a href="/logout">
                      <div className="button-solid lg">
                        <button type="submit" className="pl-1">
                          Logout
                        </button>
                      </div>
                    </a>
                  </li>
                )}
                {!this.state.loggedIn && (
                  <li className="nav-items pointer">
                    <a href="/login">
                      <div className="button-solid lg">
                        <button type="submit" className="pl-1">
                          Sign in
                        </button>
                      </div>
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </nav>
        {this.props.children}
      </div>
    );
  }
}

export default Layout;
