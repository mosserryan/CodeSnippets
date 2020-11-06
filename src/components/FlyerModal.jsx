import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import styles from "./Que.module.css";
import logger from "sabio-debug";
import "../../styles/body.css"

const _logger = logger.extend("FlyerQueueModel");

class FlyerQueueModel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: true,
        };
    }

    orderAccepted = (e) => {
        e.preventDefault()
        _logger("I've been clicked!", this.props.orderDetails)
        this.props.statusUpdate(this.props.orderDetails.orderId)
    }

     basePay = () => {
         let basePay = this.props.orderDetails.totalCost / 10
         let adjusted = basePay.toFixed(2)
        return adjusted
     } 

    render() {
        return (
            < React.Fragment >
                <Modal
                    className={`${styles.modal}`}
                    isOpen={this.state.isOpen}
                    toggle={this.props.toggleModal}
                >
                    <ModalHeader toggle={this.props.toggleModal}>
                        <div style={{ fontSize: `39px`, }}>
                            Order Details
                        </div>
                            Order #{this.props.orderDetails.orderId}
                        <div className="pt-3">
                            <b>Zone 4, Seat 1A, Row 2</b>
                        </div>
                    </ModalHeader>
                    <ModalBody>
                        <div className="row">
                            <div className={`col-md-4`}>
                                <div className="pb-3 row" style={{ fontSize: `25px` }}>
                                    <b className="col-6">Order Total: </b>
                                    <b className="col-6" style={{ textAlign: `right` }}>${this.props.orderDetails.totalCost.toFixed(2)}</b>
                                </div>
                                <div className={`example ${styles.enableScroll}`}>
                                    {this.props.orderDetails.itemNames}
                                </div>
                                <p style={{ fontSize: `20px` }} className={` mb-3 pt-2 row ${styles.borderTop}`}>
                                    <b className="col-6">Base Pay: </b>
                                    <b className="col-6" style={{ textAlign: `right` }}>${this.basePay()}</b>
                                    <b className="col-6 pb-3">Tips: </b>
                                    <b className="col-6" style={{ textAlign: `right` }}>$0.00</b>
                                    <b className={`col-6 pt-2`}>Total: </b>
                                    <b className={`col-6 `} style={{ textAlign: `right` }}>${this.basePay()}</b>
                                </p>
                                <button
                                    type="button"
                                    onClick={this.orderAccepted}
                                    className={`btn btn-primary btn-block ${styles.browserButton}`}
                                >
                                    Accept Order
                                </button>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary"  onClick={this.props.toggleModal}>
                            Close
                        </Button>
                    </ModalFooter>
                </Modal>
            </React.Fragment >
        );
    }
}
export default FlyerQueueModel;
FlyerQueueModel.propTypes = {
    toggleModal: PropTypes.func,
    statusUpdate: PropTypes.func,
    orderDetails: PropTypes.shape({
        itemNames: PropTypes.arrayOf(
            PropTypes.shape({})
        ),
        vendorName: PropTypes.string,
        totalCost: PropTypes.number,
        orderId: PropTypes.number,
    })
};