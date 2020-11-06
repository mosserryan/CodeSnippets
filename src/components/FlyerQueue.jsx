import React from "react";
import logger from "sabio-debug";
import * as orderService from "../../services/orderService";
import SingleOrder from "./SingleOrder";
import GoogleMapsV2 from "../locations/GoogleMapsV2"
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import locale from "rc-pagination/lib/locale/en_US";
import styles from "./Que.module.css";
import FlyerQueueModel from "./FlyerQueueModal"
import "../../styles/body.css"
import { toast } from "react-toastify";
import swal from "sweetalert";
import PropTypes from "prop-types";

const _logger = logger.extend("FlyerQueue");
const mapContainerStyle = {
    width: "100%",
    height: "100%",
};

class FlyerQueue extends React.Component {
    state = {
        mappedOrders: [],
        current: 1,
        totalOrders: 10,
        pageSize: 7,
        center: {
            lat: 34.1613147,
            lng: -118.1679689,
        },
        zoom: 20
    }

    componentDidMount() {
        this.getOrders()
    }

    onOrderDetailsClicked = (items, id, total, vendor, isActive, createdBy) => {
        this.toggleModal();
        this.setState((prevState) => {
            return {
                ...prevState,
                itemNames: items,
                totalCost: total,
                vendorName: vendor,
                orderId: id,
                orderStatus: isActive,
                createdBy: createdBy
            };
        });
    };

    toggleModal = () => {
        this.setState((prevState) => {
            return {
                ...prevState,
                isOpen: !prevState.isOpen,
            };
        });
    };

    getOrders = () => {
        orderService.renderOrderDetails(false, this.state.current - 1, this.state.pageSize)
            .then(this.onRenderOrdersSuccess)
            .catch(this.onRenderOrdersError)
    }

    onRenderOrdersSuccess = (response) => {
        _logger("Order Success Response: ", response.data.item.pagedItems)
        let selectedOrders = response.data.item.pagedItems
        let ordersList = []
        selectedOrders.forEach((oneOrder) => {
            if (oneOrder && oneOrder.orderItems) {
                if (oneOrder.isActive !== true) {
                    ordersList.push(
                        <SingleOrder
                            key={oneOrder.id}
                            SingleOrder={oneOrder}
                            orderDetailsClicked={this.onOrderDetailsClicked}
                            changeLocation={this.changeLocation}
                        />
                    )
                }
            }
        })
        this.setState((prevState) => {
            return {
                ...prevState,
                totalOrders: response.data.item.totalCount,
                mappedOrders: ordersList
            }
        })
    }

    onRenderOrdersError = (response) => {
        _logger("Order Error Response: ", response)
    }

    onChange = (page) => {
        _logger(page);
        this.setState(
            {
                current: page,
            },
            () => {
                this.getOrders(page - 1, this.state.pageSize);
            }
        );
    };

    statusUpdate = (Id) => {
        orderService.getOrderInfo(Id)
            .then(this.getOrderInfoSuccess)
            .catch(this.getOrderInfoError)
    }

    getOrderInfoSuccess = (response) => {
        if (response.data.item.isActive === false) {
            let data = {
                status: { isActive: true },
                id: response.data.item.id
            }
            orderService.updateOrderStatus(data.id, data.status)
                .then(this.onStatusUpdateSuccess)
                .catch(this.onStatusUpdateError)
        } else {
            toast.error("Order is no longer available")
            this.toggleModal()
            this.onChange(1);
        }
    }

    getOrderInfoError = (response) => {
        _logger("Get order info error", response)
    }

    onStatusUpdateSuccess = (response) => {
        _logger("Order Has Been Accepted!", response)
        this.toggleModal()
        this.onChange(1);
        this.props.history.push("/dashboard/flyer")
        swal("Order has been accepted!", {
            icon: "success",
          });
          
        //this is for when you can accept multiple orders//
        /* swal({
            title: 'Order has been accepted!',
            text: "Continue Flying, or go back to Flyer dashboard?",
            icon: "success",
            buttons: ["Stay here", "Flyer Dashboard"],
          }).then((result) => {
            if (result) {
                this.props.history.push("/products/new")
            }
          }) */
    }
    onStatusUpdateError = () => {
        _logger("Error")
        toast.error("Something went wrong with this order.")

    }

    render() {
        return (
            <React.Fragment>
                <div className={` ${styles.center} card col-md-12 p-0 `}>
                    <h1 className={` pl-3 pb-3 mb-0 pt-2 ${styles.locationHeader} ${styles.none} ${styles.borderBottom}`}>
                        Flyer Queue
                    </h1>
                    <div className={`row `}>
                        <div className={`${styles.borderRight} col-lg-3 ml-0 p-0`}>
                            <div className={` ${styles.none} ${styles.borderBottom} pl-0`} >
                                <div className={`${styles.info}  card-body info pl-0 pr-0`}>
                                    <div className={`col-12`}>
                                        <div className={`${styles.spaceBetween} mr-0 ml-0`}>
                                            <div className="pl-4">
                                                <h1 className={`card-title`}>
                                                    <b>Available Orders</b>
                                                </h1>
                                                <div className={`card-text pt-4 ${styles.textSizeL} `}>
                                                    Select <b>Order Details</b> for more information
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={`col-lg-9 col-12 p-0 ${styles.sNone} ${styles.mapSize}`} >
                                <GoogleMapsV2 center={this.state.center}
                                    zoom={this.state.zoom}
                                    mapContainerStyle={mapContainerStyle}>
                                </GoogleMapsV2>     
                            </div>
                            <div style={{backgroundColor: "#f0f0f0"}} className={`card-text pl-5 p-1 ${styles.sNone} ${styles.textSizeL} `}>
                                Select <b>Order Details</b> for more information
                            </div>
                            <div className={`example pb-0 ${styles.scrollBarV2}`}>
                                {this.state.mappedOrders}
                                <div className={`p-2 ${styles.pagination} ${styles.borderUp} ${styles.sNone}`}>
                                    <Pagination
                                        locale={locale}
                                        nextIcon={<em className="fa fa-caret-right" />}
                                        prevIcon={<em className="fa fa-caret-left" />}
                                        onChange={this.onChange}
                                        current={this.state.current}
                                        total={this.state.totalOrders}
                                        pageSize={this.state.pageSize}
                                    />
                                </div>
                            </div>
                            {this.state.isOpen && (
                                <FlyerQueueModel
                                    toggleModal={this.toggleModal}
                                    orderDetails={this.state}
                                    statusUpdate={this.statusUpdate}
                                />)} 
                            <div className={` pb-2 ${styles.borderUp} ${styles.none} ${styles.pagination}`}>
                                <Pagination
                                    locale={locale}
                                    nextIcon={<em className="fa fa-caret-right" />}
                                    prevIcon={<em className="fa fa-caret-left" />}
                                    onChange={this.onChange}
                                    current={this.state.current}
                                    total={this.state.totalOrders}
                                    pageSize={this.state.pageSize}
                                ></Pagination>
                            </div>
                        </div>
                        <div className={`col-md-9 col-12 p-0 ${styles.mapSize} ${styles.none}`} >
                            <GoogleMapsV2 center={this.state.center}
                                zoom={this.state.zoom}
                                mapContainerStyle={mapContainerStyle}>
                            </GoogleMapsV2>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

FlyerQueue.propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func,
    }), 
  };

export default FlyerQueue
