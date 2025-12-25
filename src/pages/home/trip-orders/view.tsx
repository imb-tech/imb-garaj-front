import TripOrderDetailRow from "./cashfow"
import TripDetailPayment from "./order-payments"

function ViewPageCashFlows() {
    return (
        <div className="py-3 px-2">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <TripOrderDetailRow />
                <TripDetailPayment />
            </div>
        </div>
    )
}

export default ViewPageCashFlows
