import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import InvoiceItem from './InvoiceItem';
// import InputGroup from 'react-bootstrap/InputGroup';

class InvoiceForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      currency: '$',
      currentDate: '',
      invoiceNumber: 1,
      dateOfIssue: '',
      billTo: '',
      billToEmail: '',
      billToAddress: '',
      billFrom: '',
      billFromEmail: '',
      billFromAddress: '',
      notes: '',
      total: '0.00',
      subTotal: '0.00',
      taxRate: '',
      taxAmount: '0.00',
      discountRate: '',
      discountAmount: '0.00',
      items: [
        {
          id: 0,
          name: '',
          description: '',
          price: '1.00',
          quantity: 1
        }
      ]
    };
  }

  componentDidMount() {
    this.handleCalculateTotal();
  }

  handleRowDel = (item) => {
    const updatedItems = this.state.items.filter(i => i.id !== item.id);
    this.setState({ items: updatedItems }, () => {
      this.handleCalculateTotal();
    });
  };

  handleAddEvent = () => {
    const id = new Date().getTime(); // Use timestamp as ID
    const newItem = {
      id: id,
      name: '',
      price: '1.00',
      description: '',
      quantity: 1
    };
    const updatedItems = [...this.state.items, newItem];
    this.setState({ items: updatedItems });
  };

  handleCalculateTotal = () => {
    let { items, taxRate, discountRate } = this.state;
    let subTotal = 0;

    items.forEach(item => {
      subTotal += parseFloat(item.price) * parseInt(item.quantity);
    });

    const taxAmount = (subTotal * (parseFloat(taxRate) / 100)).toFixed(2);
    const discountAmount = (subTotal * (parseFloat(discountRate) / 100)).toFixed(2);
    const total = (subTotal - parseFloat(discountAmount) + parseFloat(taxAmount)).toFixed(2);

    this.setState({
      subTotal: subTotal.toFixed(2),
      taxAmount,
      discountAmount,
      total
    });
  };

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value }, () => {
      if (name === 'taxRate' || name === 'discountRate') {
        this.handleCalculateTotal();
      }
    });
  };

  openModal = (event) => {
    event.preventDefault();
    this.handleCalculateTotal();
    this.setState({ isOpen: true });
  };

  closeModal = () => {
    this.setState({ isOpen: false });
  };

  render() {
    const { currency, invoiceNumber, dateOfIssue, billTo, billToEmail, billToAddress,
      billFrom, billFromEmail, billFromAddress, total, subTotal, taxRate, taxAmount,
      discountRate, discountAmount, items } = this.state;

    return (
      <Form onSubmit={this.openModal}>
        <Row>
          <Col md={8} lg={9}>
            <Card className="p-4 p-xl-5 my-3 my-xl-4">
              <div className="d-flex flex-row align-items-start justify-content-between mb-3">
                <div className="d-flex flex-column">
                  <div className="d-flex flex-column">
                    <div className="mb-2">
                      <span className="fw-bold">Current&nbsp;Date:&nbsp;</span>
                      <span className="current-date">{new Date().toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="d-flex flex-row align-items-center">
                    <span className="fw-bold d-block me-2">Due&nbsp;Date:</span>
                    <Form.Control
                      type="date"
                      value={dateOfIssue}
                      name="dateOfIssue"
                      onChange={this.handleInputChange}
                      style={{ maxWidth: '150px' }}
                      required
                    />
                  </div>
                </div>
                <div className="d-flex flex-row align-items-center">
                  <span className="fw-bold me-2">Invoice&nbsp;Number:&nbsp;</span>
                  <Form.Control
                    type="number"
                    value={invoiceNumber}
                    name="invoiceNumber"
                    onChange={this.handleInputChange}
                    min="1"
                    style={{ maxWidth: '70px' }}
                    required
                  />
                </div>
              </div>
              <hr className="my-4" />
              <Row className="mb-5">
                <Col>
                  <Form.Label className="fw-bold">Bill to:</Form.Label>
                  <Form.Control
                    placeholder="Who is this invoice to?"
                    rows={3}
                    value={billTo}
                    type="text"
                    name="billTo"
                    className="my-2"
                    onChange={this.handleInputChange}
                    autoComplete="name"
                    required
                  />
                  <Form.Control
                    placeholder="Email address"
                    value={billToEmail}
                    type="email"
                    name="billToEmail"
                    className="my-2"
                    onChange={this.handleInputChange}
                    autoComplete="email"
                    required
                  />
                  <Form.Control
                    placeholder="Billing address"
                    value={billToAddress}
                    type="text"
                    name="billToAddress"
                    className="my-2"
                    autoComplete="address"
                    onChange={this.handleInputChange}
                    required
                  />
                </Col>
                <Col>
                  <Form.Label className="fw-bold">Bill from:</Form.Label>
                  <Form.Control
                    placeholder="Who is this invoice from?"
                    rows={3}
                    value={billFrom}
                    type="text"
                    name="billFrom"
                    className="my-2"
                    onChange={this.handleInputChange}
                    autoComplete="name"
                    required
                  />
                  <Form.Control
                    placeholder="Email address"
                    value={billFromEmail}
                    type="email"
                    name="billFromEmail"
                    className="my-2"
                    onChange={this.handleInputChange}
                    autoComplete="email"
                    required
                  />
                  <Form.Control
                    placeholder="Billing address"
                    value={billFromAddress}
                    type="text"
                    name="billFromAddress"
                    className="my-2"
                    autoComplete="address"
                    onChange={this.handleInputChange}
                    required
                  />
                </Col>
              </Row>
              <InvoiceItem
                items={items}
                onItemizedItemEdit={this.handleInputChange}
                onRowAdd={this.handleAddEvent}
                onRowDel={this.handleRowDel}
                currency={currency}
              />
              <Row className="mt-4 justify-content-end">
                <Col lg={6}>
                  <div className="d-flex flex-row align-items-start justify-content-between">
                    <span className="fw-bold">Subtotal:</span>
                    <span>{currency} {subTotal}</span>
                  </div>
                  <div className="d-flex flex-row align-items-start justify-content-between mt-2">
                    <span className="fw-bold">Discount:</span>
                    <span>
                      <span className="small">({discountRate || 0}%)</span>
                      {currency} {discountAmount || 0}
                    </span>
                  </div>
                  <div className="d-flex flex-row align-items-start justify-content-between mt-2">
                    <span className="fw-bold">Tax:</span>
                    <span>
                      <span className="small">({taxRate || 0}%)</span>
                      {currency} {taxAmount || 0}
                    </span>
                  </div>
                  <div className="d-flex flex-row align-items-start justify-content-between mt-3 border-top pt-3">
                    <span className="fw-bold h4">Total:</span>
                    <span className="h4">{currency} {total}</span>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
        <Row className="mt-4 justify-content-end">
          <Col lg={6}>
            <Button type="submit">Generate Invoice</Button>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default InvoiceForm;
