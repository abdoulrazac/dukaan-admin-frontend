import {axios} from "../../../../DukaanAPI";
import React from 'react'
import {withRouter} from 'next/router';
import Loader from '../../../../components/loader';
import Head from '../../../../components/head';
import Layout from "../../../../components/layout";
import CouponForm from "../../../../forms/Coupon";
import CheckLogin from "../../../../components/CheckLogin";
import * as controller from '../../../../controllers/v2/couponsV2'
import ErrorHandler from "../../../../helpers/ErrorHandler";
import Swal from 'sweetalert2';
import ProductApplicabilityInfo from "../../../../components/ProductApplicabilityInfo";
import ProductsChooserModal from "../../../../components/ProductsChooser/ProductsChooserModal";
import ConfirmationDialog from "../../../../components/ConfirmationDialog";


class EditCoupons extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            organizations: [],
            sub_category_id: null,
            categories: [],
            subCategories: [],
            subCategoryRules: [],
            coupon: {},

            isModalOpen: false,
            modalProductTypeId: '',
            modalOrganizationId: '',
            preFilledProducts: {},
            couponProducts: {},
            couponUsers: [],
            isEditMode: true,
            isEverUsed: false,
            isConfirmationModalOpen: false,
            isApplicableAllUsers: false,
            isSubCategoryBulk: false
        }
    }


    onUnsavedChanges = () => {
        this.setState({isConfirmationModalOpen: true})
    }

    onAgree = () => {
        this.setState({
            isConfirmationModalOpen: false,
            couponProducts: {}
        })
    }

    onDisagree = () => {
        this.setState({isConfirmationModalOpen: false})
    }

    fillcouponProducts = (products) => {
        const groupBy = (array, key) => {
            return array.reduce((result, currentValue) => {
                (result[currentValue[key]] = result[currentValue[key]] || []).push(
                    currentValue
                );
                return result;
            }, {});
        };
        const productsGroupedByType = groupBy(products, 'product_type_id');
        this.setState({
            preFilledProducts: productsGroupedByType,
            couponProducts: productsGroupedByType
        })
    }

    componentDidMount() {
        const search = window.location.search;
        const params = new URLSearchParams(search);
        const couponId = params.get('couponId');
        if (!couponId) {
            window.location.href = '/'
        }
        controller.getCoupon(couponId).then((response) => {
            this.setState({
                coupon: response.data,
                isEverUsed: response.data.is_ever_used,
                isApplicableAllUsers: response.data.applicable_all_users,
                isSubCategoryBulk: response.data.is_subcategory_bulk
            })
            return controller.fetchEditCouponData(response.data)
        }).then(([subCategoryId, categories, subCategoryRules, subCategories, organizations, couponProducts, couponUsers]) => {
            this.setState({
                sub_category_id: subCategoryId.data,
                categories: categories.data,
                subCategoryRules: subCategoryRules.data,
                subCategories: subCategories.data,
                organizations: organizations.data,
                modalOrganizationId: organizations.data[0].id,
                couponUsers: couponUsers.data.map(u => u.user),
                loaded: true
            })
            this.fillcouponProducts(couponProducts.data)
        }).catch(error => {
            ErrorHandler.handle(error)
            Swal.fire({
                type: "error",
                title: "Error fetching resources!",
                text: error
            });
        });
    }

    fillSubCategories = (data) => {
        controller.fetchSubCategories(data).then((subCategories) => {
            this.setState({
                subCategories: subCategories.data.filter((c) => !c.is_bulk)
            })
        }).catch((error) => {
            ErrorHandler.handle(error)
        })
    };

    handleCategoryChange = (event) => {
        this.fillSubCategories({category: event.target.value})
        this.setState({
            subCategoryRules: []
        })
        return event.target.value
    }


    fillSubCategoryRules = (data) => {
        controller.fetchSubCategoryRules(data).then((subCategoryRules) => {
            this.setState({
                subCategoryRules: subCategoryRules.data,
            })
        }).catch((error) => {
            ErrorHandler.handle(error)
        })
    }

    handleSubCategoryChange = (event, category) => {
        this.fillSubCategoryRules({id: event.target.value, category: category})
        return parseInt(event.target.value)
    }

    handleOpenModal = (productTypeId) => {
        this.setState({
            isModalOpen: true,
            modalProductTypeId: productTypeId
        })
    }

    handleCloseModal = () => {
        this.setState({
            isModalOpen: false
        })
    } 

    onProductsSelected = (productTypeId, products) => {
        const currentProductsForProductTypeId = {}
        currentProductsForProductTypeId[productTypeId] = products

        this.setState({
            couponProducts: {
                ...this.state.couponProducts,
                ...currentProductsForProductTypeId
            }
        })
    }

    onOrganizationChange = (event) => {
        this.setState({
            modalOrganizationId: event.target.value
        })
    }

    render() {

        return (
            <div>
                <Head title="Coding Blocks | Dukaan | Edit Coupon"/>
                <Layout/>
                <CheckLogin>
                    <div className={"col-md-12"}>
                        {/* Title */}
                        <div className={"d-flex justify-content-center mt-1 pt-3 pb-1"}>
                            <h2 className={"title"}>Edit Coupon</h2>
                        </div>
                        {this.state.loaded &&
                        <div className={"col-md-6 pull-left"}>
                            <CouponForm data={this.state}
                                        onUnsavedChanges={this.onUnsavedChanges}
                                        handleSubCategoryChange={this.handleSubCategoryChange}
                                        onOrganizationChange={this.onOrganizationChange}
                                        handleCategoryChange={this.handleCategoryChange}/>
                        </div>
                        }
                        <div className={"col-md-6 pull-right"}>
                            {/* Product applicability pane */}
                            {this.state.subCategoryRules.length > 0 &&
                            <ProductApplicabilityInfo productDetails={this.state.subCategoryRules}
                                                      couponProducts={this.state.couponProducts}
                                                      handleModifyProducts={this.handleOpenModal}
                            />
                            }
                        </div>

                        {this.state.loaded &&
                        this.state.modalProductTypeId &&
                        this.state.modalOrganizationId ?
                            <div>
                                <ProductsChooserModal
                                    preFilledProducts={
                                        this.state.preFilledProducts[this.state.modalProductTypeId]
                                    }
                                    currentCouponProducts={
                                        this.state.couponProducts[this.state.modalProductTypeId]
                                    }
                                    isModalOpen={this.state.isModalOpen}
                                    handleCloseModal={this.handleCloseModal}
                                    onProductsSelected={this.onProductsSelected}
                                    organizationId={this.state.modalOrganizationId}
                                    productTypeId={this.state.modalProductTypeId}
                                    isEverUsed={this.state.isEverUsed}
                                    isSubCategoryBulk={this.state.isSubCategoryBulk}/>
                            </div>
                            :
                            <div/>
                        }

                        <ConfirmationDialog isOpen={this.state.isConfirmationModalOpen} onAgree={this.onAgree}
                                            onDisagree={this.onDisagree}/>
                    </div>
                </CheckLogin>
            </div>
        )
    }
}

export default withRouter(EditCoupons)
