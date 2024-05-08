console.log("payment calculator work");
export default async function decorate(block) {
    console.log(block);
    var container = document.querySelector('.paymentcalculator');
    const jsonData = {
        "total": 8,
        "offset": 0,
        "limit": 8,
        "data": [
          {
            "Name": "Loan_amount_text",
            "Type": "plaintext",
            "Label": "",
            "Placeholder": "",
            "Value": "",
            "Options": "",
            "Mandatory": "",
            "Style": "",
            "ID": "loan-amt-tex",
            "Fieldset": "Loan_amount",
            "Minimum": "",
            "Maximum": ""
          },
          {
            "Name": "Loan Amount",
            "Type": "range",
            "Label": "Loan Amount (in INR)",
            "Placeholder": "",
            "Value": "500000",
            "Options": "",
            "Mandatory": "true",
            "Style": "",
            "ID": "Loan_amount",
            "Fieldset": "Loan_amount",
            "Minimum": "500000",
            "Maximum": "5000000"
          },
          // Other data objects...
        ],
        ":type": "sheet"
      };
      
      // Extract minimum and maximum values for each field
      const minMaxValues = jsonData.data.map(item => {
        return {
            Name: item.Name,
            Type: item.Type,
            Label: item.Label,
            Placeholder: item.Placeholder,
            Value: item.Value,
            Options: item.Options,
            Mandatory: item.Mandatory,
            Style: item.Style,
            ID: item.ID,
            Fieldset: item.Fieldset,
            Minimum: item.Minimum,
            Maximum: item.Maximum
        };
      });
      
      console.log(minMaxValues[1].Maximum);
    const maxvalue  = minMaxValues[1].Maximum;
        // Select the container element
       // HTML code to be appended
var htmlCode = `
    <div class="header2">
        <h1 style="color: #6258A8">Loan Calculator</h1>
        <button>
            <i class="bi bi-list"></i>
        </button>
    </div>
    <div class="sub-container">
        <div class="view">
            <div class="details">
                <div>
                    <div class="detail">
                        <p style="color: #8CB133">Amount</p>
                        <p id="loan-amt-text" style="color: #8CB133"></p>
                    </div>
                    <input type="range" id="loan-amount" min="0" max="10000000" step="50000">
                </div>
                <div>
                    <div class="detail">
                        <p style="color: #8CB133">Length</p>
                        <p id="loan-period-text" style="color: #8CB133"></p>
                    </div>
                    <input type="range" id="loan-period" min="1" max="30" step="1">
                </div>
                <div>
                    <div class="detail">
                        <p style="color: #8CB133">% Interest</p>
                        <p id="interest-rate-text" style="color: #8CB133"></p>
                    </div>
                    <input type="range" id="interest-rate" min="1" max="15" step="0.5">
                </div>
            </div>
            <div class="footer">
                <p id="price-container"><span id="price">0</span>/mo</p>
            </div>
        </div>
        <div class="breakup">
            <canvas id="pieChart"></canvas>
        </div>
    </div>
    <div>
        <div class="loan-details">
            <div class='chart-details'>
                <p style="color: #9088D2">Principal</p>
                <p id="cp" style="color: #130F31; font-size: 17px;"></p>
            </div>
            <div class='chart-details'>
                <p style="color: #9088D2">Interest</p>
                <p id="ci" style="color: #130F31; font-size: 17px;"></p>
            </div>
            <div class='chart-details'>
                <p style="color: #9088D2">Total Payable</p>
                <p id="ct" style="color: #130F31; font-size: 17px;"></p>
            </div>
        </div>
    </div>
`;
 
// Append the HTML code inside the container
container.innerHTML += htmlCode;
 
 
var P, R, N, pie, line;
var loan_amt_slider = document.getElementById("loan-amount");
var int_rate_slider = document.getElementById("interest-rate");
var loan_period_slider = document.getElementById("loan-period");
 
// update loan amount
loan_amt_slider.addEventListener("input", (self) => {
    document.querySelector("#loan-amt-text").innerText =
        parseInt(self.target.value).toLocaleString("en-US") + "₹";
    P = parseFloat(self.target.value);
    displayDetails();
});
 
// update Rate of Interest
int_rate_slider.addEventListener("input", (self) => {
    document.querySelector("#interest-rate-text").innerText =
        self.target.value + "%";
    R = parseFloat(self.target.value);
    displayDetails();
});
 
// update loan period
loan_period_slider.addEventListener("input", (self) => {
    document.querySelector("#loan-period-text").innerText =
        self.target.value + " years";
    N = parseFloat(self.target.value);
    displayDetails();
});
 
// calculate total Interest payable
function calculateLoanDetails(p, r, emi) {
    /*
        p: principal
        r: rate of interest
        emi: monthly emi
    */
    let totalInterest = 0;
    let yearlyInterest = [];
    let yearPrincipal = [];
    let years = [];
    let year = 1;
    let [counter, principal, interes] = [0, 0, 0];
    while (p > 0) {
        let interest = parseFloat(p) * parseFloat(r);
        p = parseFloat(p) - (parseFloat(emi) - interest);
        totalInterest += interest;
        principal += parseFloat(emi) - interest;
        interes += interest;
        if (++counter == 12) {
            years.push(year++);
            yearlyInterest.push(parseInt(interes));
            yearPrincipal.push(parseInt(principal));
            counter = 0;
        }
    }
    line.data.datasets[0].data = yearPrincipal;
    line.data.datasets[1].data = yearlyInterest;
    line.data.labels = years;
    return totalInterest;
}
 
// calculate details
function displayDetails() {
    let r = parseFloat(R) / 1200;
    let n = parseFloat(N) * 12;
 
    let num = parseFloat(P) * r * Math.pow(1 + r, n);
    let denom = Math.pow(1 + r, n) - 1;
    let emi = parseFloat(num) / parseFloat(denom);
 
    let payabaleInterest = calculateLoanDetails(P, r, emi);
 
    let opts = '{style: "decimal", currency: "US"}';
 
    document.querySelector("#cp").innerText =
        parseFloat(P).toLocaleString("en-US", opts) + "₹";
 
    document.querySelector("#ci").innerText =
        parseFloat(payabaleInterest).toLocaleString("en-US", opts) + "₹";
 
    document.querySelector("#ct").innerText =
        parseFloat(parseFloat(P) + parseFloat(payabaleInterest)).toLocaleString(
            "en-US",
            opts
        ) + "₹";
 
    document.querySelector("#price").innerText =
        parseFloat(emi).toLocaleString("en-US", opts) + "₹";
 
    pie.data.datasets[0].data[0] = P;
    pie.data.datasets[0].data[1] = payabaleInterest;
    pie.update();
    line.update();
}
 
// Initialize everything
function initialize() {
    document.querySelector("#loan-amt-text").innerText =
        parseInt(loan_amt_slider.value).toLocaleString("en-US") + "₹";
    P = parseFloat(document.getElementById("loan-amount").value);
 
    document.querySelector("#interest-rate-text").innerText =
        int_rate_slider.value + "%";
    R = parseFloat(document.getElementById("interest-rate").value);
 
    document.querySelector("#loan-period-text").innerText =
        loan_period_slider.value + " years";
    N = parseFloat(document.getElementById("loan-period").value);
 
    line = new Chart(document.getElementById("lineChart"), {
        data: {
            datasets: [
                {
                    type: "line",
                    label: "Yearly Principal paid",
                    borderColor: "rgb(54, 162, 235)",
                    data: []
                },
                {
                    type: "line",
                    label: "Yearly Interest paid",
                    borderColor: "rgb(255, 99, 132)",
                    data: []
                }
            ],
            labels: []
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: "Yearly Payment Breakdown"
                }
            },
            scales: {
                x: {
                    title: {
                        color: "grey",
                        display: true,
                        text: "Years Passed"
                    }
                },
                y: {
                    title: {
                        color: "grey",
                        display: true,
                        text: "Money in Rs."
                    }
                }
            }
        }
    });
 
    pie = new Chart(document.getElementById("pieChart"), {
        type: "doughnut",
        data: {
            labels: ["Principal", "Interest"],
            datasets: [
                {
                    label: "Home Loan Details",
                    data: [0, 0],
                    backgroundColor: ["rgb(140, 177, 51)", "rgb(59, 59, 59)"],
                    hoverOffset: 4
                }
            ]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: "Payment Breakup"
                }
            }
        }
    });
    displayDetails();
}
initialize();
}