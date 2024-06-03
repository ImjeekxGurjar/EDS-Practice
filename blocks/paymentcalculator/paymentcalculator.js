export default async function decorate(block) {
    var container = document.querySelector('.paymentcalculator');
    function createElement(type, attributes = {}, ...children) {
        const element = document.createElement(type);
        for (const [key, value] of Object.entries(attributes)) {
            element.setAttribute(key, value);
        }
        for (const child of children) {
            if (typeof child === "string") {
                element.appendChild(document.createTextNode(child));
            } else {
                element.appendChild(child);
            }
        }
        return element;
    }
    const header = createElement('div', { class: 'header' },
        createElement('h1', { style: 'color: #6258A8' }, 'Loan Calculator'),
    );
    const amountDetail = createElement('div', {},
        createElement('div', { class: 'detail' },
            createElement('p', { style: 'color: #9088D2' }, 'Amount'),
            createElement('p', { id: 'loan-amt-text', style: 'color: #6258A8' })
        ),
        createElement('input', { type: 'range', id: 'loan-amount', min: '500000', max: '50000000', step: '50000' })
    );
    const interestDetail = createElement('div', {},
        createElement('div', { class: 'detail' },
            createElement('p', { style: 'color: #9088D2' }, '% Interest'),
            createElement('p', { id: 'interest-rate-text', style: 'color: #6258A8' })
        ),
        createElement('input', { type: 'range', id: 'interest-rate', min: '6', max: '15', step: '0.5' })
    );
    const tenureYearsDetail = createElement('div', {},
        createElement('div', { class: 'detail' },
            createElement('p', { style: 'color: #9088D2' }, 'Tenure(Years)'),
            createElement('p', { id: 'loan-period-text', style: 'color: #6258A8' })
        ),
        createElement('input', { type: 'range', id: 'loan-period', min: '1', max: '30', step: '1' })
    );
    const tenureMonthsDetail = createElement('div', {},
        createElement('div', { class: 'detail' },
            createElement('p', { style: 'color: #9088D2' }, 'Tenure(Months)'),
            createElement('p', { id: 'loan-period-month-text', style: 'color: #6258A8' })
        ),
        createElement('input', { type: 'range', id: 'loan-period-month', min: '1', max: '11', step: '1' })
    );
    const details = createElement('div', { class: 'details' },
        amountDetail, interestDetail, tenureYearsDetail, tenureMonthsDetail
    );
    const footer = createElement('div', { class: 'footer' },
        createElement('p', { id: 'price-container' },
            createElement('span', { id: 'price' }, '0'), '/mo'
        )
    );
    const view = createElement('div', { class: 'view' }, details, footer);
    const breakup = createElement('div', { class: 'breakup' },
        createElement('canvas', { id: 'pieChart' })
    );
    const subContainer = createElement('div', { class: 'sub-container' }, view, breakup);
    const loanDetails = createElement('div', { class: 'loan-details' },
        createElement('div', { class: 'chart-details' },
            createElement('p', { style: 'color: #9088D2' }, 'Principal'),
            createElement('p', { id: 'cp', style: 'color: #130F31; font-size: 17px;' })
        ),
        createElement('div', { class: 'chart-details' },
            createElement('p', { style: 'color: #9088D2' }, 'Interest'),
            createElement('p', { id: 'ci', style: 'color: #130F31; font-size: 17px;' })
        ),
        createElement('div', { class: 'chart-details' },
            createElement('p', { style: 'color: #9088D2' }, 'Total Payable'),
            createElement('p', { id: 'ct', style: 'color: #130F31; font-size: 17px;' })
        )
    );
    container.append(header, subContainer, loanDetails);
    var P, R, N, M, pie, line;
    var loan_amt_slider = document.getElementById("loan-amount");
    var int_rate_slider = document.getElementById("interest-rate");
    var loan_period_slider = document.getElementById("loan-period");
    var loan_period_slider_month = document.getElementById("loan-period-month");
    loan_amt_slider.addEventListener("input", (self) => {
        document.querySelector("#loan-amt-text").innerText =
            parseInt(self.target.value).toLocaleString("en-IN", { style: "currency", currency: "INR" });
        P = parseFloat(self.target.value);
        displayDetails();
    });
    int_rate_slider.addEventListener("input", (self) => {
        document.querySelector("#interest-rate-text").innerText =
            self.target.value + "%";
        R = parseFloat(self.target.value);
        displayDetails();
    });
    loan_period_slider.addEventListener("input", (self) => {
        document.querySelector("#loan-period-text").innerText =
            self.target.value + " years";
        N = parseFloat(self.target.value);
        displayDetails();
    });
    loan_period_slider_month.addEventListener("input", (self) => {
        document.querySelector("#loan-period-month-text").innerText =
            self.target.value + " months";
        M = parseFloat(self.target.value);
        displayDetails();
    });
    function calculateLoanDetails(p, r, emi, n, m) {
        let totalInterest = 0;
        let yearlyInterest = [];
        let yearPrincipal = [];
        let years = [];
        let year = 1;
        let [counter, principal, interes] = [0, 0, 0];
        let totalMonths = n * 12 + m;
        for (let i = 0; i < totalMonths; i++) {
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
    function displayDetails() {
        let r = parseFloat(R) / 1200;
        let n = parseFloat(N);
        let m = parseFloat(M);
        let totalMonths = n * 12 + m;
 
        let num = parseFloat(P) * r * Math.pow(1 + r, totalMonths);
        let denom = Math.pow(1 + r, totalMonths) - 1;
        let emi = parseFloat(num) / parseFloat(denom);
 
        let payableInterest = calculateLoanDetails(P, r, emi, n, m);
 
        let opts = { style: "currency", currency: "INR" };
 
        document.querySelector("#cp").innerText =
            P.toLocaleString("en-IN", opts);
 
        document.querySelector("#ci").innerText =
            payableInterest.toLocaleString("en-IN", opts);
 
        document.querySelector("#ct").innerText =
            (P + payableInterest).toLocaleString("en-IN", opts);
 
        document.querySelector("#price").innerText =
            emi.toLocaleString("en-IN", opts);
 
        pie.data.datasets[0].data[0] = P;
        pie.data.datasets[0].data[1] = payableInterest;
        pie.update();
        line.update();
    }
 
    function initialize() {
        document.querySelector("#loan-amt-text").innerText =
            parseInt(loan_amt_slider.value).toLocaleString("en-IN", { style: "currency", currency: "INR" });
        P = parseFloat(document.getElementById("loan-amount").value);
        document.querySelector("#interest-rate-text").innerText =
            int_rate_slider.value + "%";
        R = parseFloat(document.getElementById("interest-rate").value);
 
        document.querySelector("#loan-period-text").innerText =
            loan_period_slider.value + " years";
        N = parseFloat(document.getElementById("loan-period").value);
 
        document.querySelector("#loan-period-month-text").innerText =
            loan_period_slider_month.value + " months";
        M = parseFloat(document.getElementById("loan-period-month").value);
 
        line = new Chart(document.getElementById("lineChart"), {
            data: {
                labels: [],
                datasets: [
                    {
                        label: "Principal",
                        backgroundColor: "rgb(255, 99, 132)",
                        borderColor: "rgb(255, 99, 132)",
                        data: [],
                    },
                    {
                        label: "Interest",
                        backgroundColor: "rgb(54, 162, 235)",
                        borderColor: "rgb(54, 162, 235)",
                        data: [],
                    },
                ],
            },
            type: "line",
            options: {
                scales: {
                    y: {
                        ticks: {
                            callback: function (val) {
                                return val.toLocaleString("en-IN", {
                                    style: "currency",
                                    currency: "INR",
                                });
                            },
                        },
                    },
                },
            },
        });
        pie = new Chart(document.getElementById("pieChart"), {
            type: "doughnut",
            data: {
                labels: ["Principal", "Interest"],
                datasets: [
                    {
                        data: [P, 0],
                        backgroundColor: ["rgb(255, 99, 132)", "rgb(54, 162, 235)"],
                        hoverOffset: 4,
                    },
                ],
            },
        });
        displayDetails();
    }
    initialize();
}