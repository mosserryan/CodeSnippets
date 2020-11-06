import React from "react";
import PropTypes from "prop-types";
import logger from "sabio-debug";
import styles from "./Que.module.css";

const _logger = logger.extend("SingleOrder")

const SingleOrder = (props) => {
    const detailedOrder = props.SingleOrder.orderItems;
    const oneOrder = props.SingleOrder

    _logger(oneOrder)

    let mappedOrders = {

        orderName: detailedOrder.map((order, index) => {
            let cost = order.cost * order.quantity
            return (
            <React.Fragment key={index}>
                <div className="row" >
                    <div className="col-6">
                        <b>{order.name}</b>
                    </div>
                    <div style={{ textAlign: `right` }} className="col-6">
                        ${cost.toFixed(2)}
                    </div>
                </div>
                <p className="mb-3">
                    Quantity: {order.quantity}
                </p>
            </React.Fragment>
            )
        })
    }

    const toggleModal = () => {
        props.orderDetailsClicked(mappedOrders.orderName, oneOrder.id, oneOrder.total, detailedOrder[0].vendorName, oneOrder.isActive, oneOrder.createdBy[0])
    }

    const changeLocation = () => {
       props.changeLocation(detailedOrder[0].vendorName)
    }

    const basePay = () => {
        let basePay = oneOrder.total / 10
        let adjusted = basePay.toFixed(2)
        return adjusted
    } 

    return (
        <React.Fragment>
            <div onClick={changeLocation} className={`col-md-12 pr-0 ${styles.opacity}`} style={{paddingLeft: `14px`}}>
                <div className={`${styles.hoverCard}`}>
                    <div className={`mb-0 ${styles.borderBlue}`}>
                        <div className="text-white bg-info card-header p-0">
                            <div className="row pb-2 pt-2 ml-3">
                                <div className="col-6 pl-1">
                                    {oneOrder.createdBy[0].firstName} {oneOrder.createdBy[0].lastName}
                                </div>
                                <div className="col-6 pr-5" style={{ textAlign: `right` }}>
                                    {`Order #${oneOrder.id}`}
                                </div>
                            </div>
                        </div>
                        <div className={`${styles.borderBottom} ${styles.borderUp} ${styles.backgroundLogo} card-body p-0"`}>
                            <div className={`row ${styles.spaceBetween} mr-0 ml-0`}>
                                <h3 className="col-6 pl-0">
                                    {detailedOrder && detailedOrder[0].vendorName}
                                </h3>
                                <h4 className="col-6" style={{ textAlign: `right` }}>
                                    ${basePay()}
                                </h4>
                            </div>
                            <div className="card-text">
                                <div className={`row ${styles.info}`}>
                                <em className="fa-1x pl-3 mr-1 mt-1 fas icon-info"></em>
                                    <h4 onClick={toggleModal}>Order Details</h4>
                                </div>
                            </div>
                            <div className={`row ${styles.spaceBetween} mr-0 ml-0`}>
                                <div className="col-6 pl-0">
                                    {detailedOrder.length} Items
                                </div>
                                <div className="col-6" style={{ textAlign: `right` }}>
                                    {detailedOrder[0].vendorStadiumLocation}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment >
    )
}

SingleOrder.propTypes = {
    orderDetailsClicked: PropTypes.func,
    changeLocation: PropTypes.func,
    SingleOrder: PropTypes.shape({
        orderItems: PropTypes.arrayOf(
            PropTypes.shape({
                vendorName: PropTypes.string,
                vendorStadiumLocation: PropTypes.string
            })
        ),
        id: PropTypes.number,
        name: PropTypes.string,
        total: PropTypes.number,
        isActive: PropTypes.bool,
        createdBy: PropTypes.arrayOf(
            PropTypes.shape({
                firstName: PropTypes.string,
                lastName: PropTypes.string
            })
            
        )
    }),
    OrderId: PropTypes.shape({
        orderId: PropTypes.number,
        map: PropTypes.func,
    })
}

export default SingleOrder