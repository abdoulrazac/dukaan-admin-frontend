import React from 'react';
import Router from 'next/router';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import Grid from "@material-ui/core/Grid";
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Chip from "@material-ui/core/Chip";
import * as controller from "../../controllers/v2/couponsV2";
import CircularProgress from "@material-ui/core/CircularProgress";
import TablePagination from "@material-ui/core/TablePagination";
import { withStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Swal from 'sweetalert2';
import Link from "next/link";
import withReactContent from 'sweetalert2-react-content';
import CouponUsersList from './CouponUsersList'


const PaginationTheme = withStyles({
    actions: {
        color: "red",
        backgroundColor: 'white',
    }
})(TablePagination);

const useStyles = theme => ({
        root: {
        	background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        	color: 'white',
        	border: 0,
            borderRadius: 3,
            boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)'
        },
  });

const ReactSwal = withReactContent(Swal);

class CouponsTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            coupons: [],
            totalCoupons: 0,
            rowsPerPage: 10,
            currentPage: 0,
            totalPages: 0,
        }
    }

    resetPageInfo = () => {
        this.setState({
            rowsPerPage: 10,
            currentPage: 0,
            totalPages: 0,
        })
    }

    fillTable = () => {
        controller.searchCoupons(this.props.filterParams, {
            rowsPerPage: this.state.rowsPerPage,
            currentPage: this.state.currentPage,
        }).then((response) => {
            this.setState({
                coupons: response.data.coupons,
                totalCoupons: response.data.totalCoupons,
                totalPages: response.data.pagesInfo.pageCount
            })
        }).catch((error) => {
            Swal.fire({
                type: 'error',
                title: 'Error while fetching coupons!',
                text: error
            });
            this.setState({
                loading: false
            });
        });
    }

    componentDidMount() {
        this.fillTable()
    }


    handleChangePage = (event, newPage) => {
        this.setState({
            currentPage: newPage
        }, () => {
            this.fillTable()
        })

    }

    handleChangeRowsPerPage = (event) => {
        this.setState({
            rowsPerPage: parseInt(event.target.value, 10),
            currentPage: 0
        }, () => {
            this.fillTable()
        })
    }

    handleDeleteCoupon = (coupon) => {
        Swal.fire({
            title: "Are you sure you want to delete coupon ?????" + coupon.code + " ?",
            type: 'question',
            confirmButtonColor: '#f66',
            confirmButtonText: "Yes, delete!",
            cancelButtonText: "No, stop!",
            showCancelButton: true,
            showConfirmButton: true,
            showCloseButton: true
        }).then((result) => {
            if (result.value) {
                // Confirmation passed, delete coupon.
                controller.handleDeleteCoupon(coupon.id).then((response) => {
                    // Remove the coupon from the table.
                    let coupons = this.state.coupons;
                    let couponIndex = this.state.coupons.indexOf(coupon);
                    coupons.splice(couponIndex, 1);
                    this.setState({
                        coupons: coupons
                    });
                    // Show that the job is done
                    Swal.fire({
                        title: 'Coupon ' + coupon.code + ' Deleted!',
                        type: "info",
                        timer: '1500',
                        showConfirmButton: true,
                        confirmButtonText: "Okay"
                    });
                }).catch((error) => {
                    Swal.fire({
                        title: "Error while deleting coupon!",
                        html: "Error: " + error,
                        type: "error",
                        showConfirmButton: true
                    });
                });
            }
        });
    }

    onViewUsersClick = async (couponId) => {

        const response = await controller.getAppliedCouponUsersList({ id: couponId })

        const appliedCouponUsersPaymentStatus = {
        	created:  'Unpaid',
        	captured: 'Paid',
        	refunded: 'Refunded',
        	partially_refunded: 'Partially Refunded'
        }

        const appliedCouponUsersList = response.data.map((list) => ({
        	...list,
        	...{paymentStatus: appliedCouponUsersPaymentStatus[list.paymentStatus]}
        })).sort((a, b) => {
        		return a.paymentStatus.localeCompare(b.paymentStatus)}
        	);

        ReactSwal.fire({
            title: "Coupon Users!",
            html: <CouponUsersList couponUsersList={appliedCouponUsersList}/>,
            heightAuto: false,
            width: 800,
            confirmButtonColor: "#f66",
            confirmButtonText: "OK!",
            showConfirmButton: true,
        })
       
    }

    render() {
    	const { classes } = this.props;

        if (!this.state.coupons) {
            return (
                <CircularProgress/>
            )
        }
        return (
            <div>
             <Grid xs={11} className={"mt-5 mr-5"}>
                <Paper>
                    <TableContainer>
                        <Grid container justify="center" className={"mb-1"}>
                            <h2 className={"title"}>Coupon Results</h2>
                         </Grid>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center" className={"red"}>CODE</TableCell>
                                    <TableCell align="center" className={"red"}>CATEGORY</TableCell>
                                    <TableCell align="center" className={"red"}>SUB CATEGORY</TableCell>
                                    <TableCell align="center" className={"red"}>MODE</TableCell>
                                    <TableCell align="center" className={"red"}>DISCOUNT</TableCell>
                                    <TableCell align="center" className={"red"}>LEFT</TableCell>
                                    <TableCell align="center" className={"red"}>STATUS</TableCell>
                                    <TableCell align="center" className={"red"}>CREATED BY</TableCell>
                                    <TableCell align="center" className={"red"}>USAGE</TableCell>
                                    <TableCell align="center" className={"red"}>EDIT</TableCell>
                                    <TableCell align="center" className={"red"}>DELETE</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.coupons.map((coupon) => (
                                    <TableRow key={coupon.id} 
                                    style={{borderTop: '1px solid lightgrey'}}>
                                        <TableCell align="center">
                                            {coupon.code}
                                        </TableCell>
                                        <TableCell align="center">{coupon.category}</TableCell>
                                        <TableCell align="center">{coupon.sub_category_name}</TableCell>
                                        <TableCell align="center">{coupon.mode}</TableCell>
                                        <TableCell align="center">{
                                            coupon.mode === 'flat' ? coupon.amount : `${coupon.percentage}%`
                                        }</TableCell>
                                        <TableCell align="center">{coupon.left}</TableCell>
                                        <TableCell align="center">{
                                            coupon.active === true ? 'Active' : 'Inactive'
                                        }
                                        </TableCell>
                                        <TableCell align="center">{coupon.created_by}</TableCell>

                                         <TableCell align="center">
                                            <Button size="small" variant="outlined" 
                                                className={classes.root}
                                                onClick={() => { this.onViewUsersClick(coupon.id) }}>
                                                View
                                            </Button>
                                        </TableCell>

                                        <TableCell align="center">
                                            <Link href={`/admin/coupons2/edit?couponId=${coupon.id}`}>
                                                <Button size="small" variant="outlined"
                                                        className={classes.root}>
                                                    Edit
                                                </Button>
                                            </Link>
                                         
                                        </TableCell>

                                        <TableCell align="center">
                                            <Button size="small" variant="outlined" 
                                                className={classes.root}
                                                onClick={() => { this.handleDeleteCoupon(coupon) }}>
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <PaginationTheme
                        rowsPerPageOptions={[5,10]}
                        component="div"
                        count={this.state.totalCoupons}
                        rowsPerPage={this.state.rowsPerPage}
                        page={this.state.currentPage}
                        onChangePage={this.handleChangePage}
                        onChangeRowsPerPage={this.handleChangeRowsPerPage}
                    />
                </Paper>
            </Grid>
            </div>
        );
    }

}

export default withStyles(useStyles)(CouponsTable)
