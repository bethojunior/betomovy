const TIME = 5000

function numberToReal(number){
    var number = number.toFixed(2).split('.');
    number[0] = "R$ " + number[0].split(/(?=(?:...)*$)/).join('.');
    return number.join(',');
}


function reduceTextByChars(text,chars){

    if(text.length >= chars)
        return text.slice(0,chars) + '...'

    return text 
}


// new Chart(document.getElementById("line-chart-trip"), {
//     type: 'line',
//     data: {
//       labels: ['DIMHEIRO','VOUCHER'],
//       datasets: [{ 
//             data: [0,4],
//             label: "Africa",
//             backgroundColor: 'yellow',
//             borderColor: "yellow",
//             fill: false
//         }, { 
//             data: [0,8],
//             label: "Asia",
//             backgroundColor: 'orange',
//             borderColor: "orange",
//             fill: false
//         }]
//     },
//     options: {
//       title: {
//         display: false
//       }
//     }
//   });

function changeCategoryDriver(event, categoryDriver){
    let i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(categoryDriver).style.display = "block";
    event.currentTarget.className += " active";
}
function changeTime(evt, cityName) {
    let i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
}

//  new Chart(document.getElementById("line-chart"),  {
//     type: 'line',
//     data: {
//       labels: [1500,1600,1700,1750,1800,1850,1900,1950,1999,2050],
//       datasets: [{ 
//           data: [86,114,106,106,107,111,133,221,783,2478],
//           label: "Africa",
//           borderColor: "#3e95cd",
//           fill: false
//         }, { 
//           data: [282,350,411,502,635,809,947,1402,3700,5267],
//           label: "Asia",
//           borderColor: "#8e5ea2",
//           fill: false
//         }, { 
//           data: [168,170,178,190,203,276,408,547,675,734],
//           label: "Europe",
//           borderColor: "#3cba9f",
//           fill: false
//         }, { 
//           data: [40,20,10,16,24,38,74,167,508,784],
//           label: "Latin America",
//           borderColor: "#e8c3b9",
//           fill: false
//         }, { 
//           data: [6,3,2,2,7,26,82,172,312,433],
//           label: "North America",
//           borderColor: "#c45850",
//           fill: false
//         }
//       ]
//     },
//     options: {
//       title: {
//         display: false,
//         text: 'World population per region (in millions)'
//       }
//     }
//   });

function currentQuantities({data}) {
    Object.keys(data).map(key=>{
        const element = document.getElementById(key)
        if(element !== null)
            element.innerHTML = data[key]
    })
} 

function getQuantitiesTrip({data}){ 
    const resRacing = []   
    const resCancel = []
    const resTrip = [] 

    resRacing.push(parseInt(data['totalMoneyTrips']))
    resRacing.push(parseInt(data['totalVoucherTrips']))   

    resCancel.push(parseInt(data['totalCanceledByDriver']))  
    resCancel.push(parseInt(data['totalCanceledByCustomer']))

    resTrip.push(parseInt(data['acceptedQuantity']))
    resTrip.push(parseInt(parseInt(data['todayQuantity']) - parseInt(data['acceptedQuantity'])))

    new Chart(document.getElementById('myChart').getContext('2d'), {
        type: 'doughnut',
        data: {
            labels: ["DINHEIRO", "VOUCHER"],
            datasets: [
            {
                label: "Population (millions)",
                backgroundColor: ["#33cc33", "#ffff33"],
                data: resRacing
            }
            ]
        },
        options: {
            title: {
                display: false
            }
        }
    })
    new Chart(document.getElementById("bar-chart"), {
        type: 'horizontalBar',
        data: {
            labels: ['MOTORISTA', 'CLIENTE'],
            datasets: [{ 
                data: resCancel,
                backgroundColor: ['yellow', 'orange']
            }]
        },
        options: {
            legend: {
                display: false
            },
            tooltips: {
                enabled: true
            },
            title: {
                display: true,
                text: `TOTAL: ${resCancel[0] + resCancel[1]}`
            },
            scales: {
                xAxes: [{
                    ticks: { 
                        fixedStepSize: 1.0, 
                        min: 0
                    }
                }],
            }
        }
    });
    new Chart(document.getElementById("bar-chart-viagens"), {
        type: 'horizontalBar',
        data: {
            labels: ['ACEITAS', 'FINALIZADAS'],
            datasets: [{ 
                data: resTrip,
                backgroundColor: ['yellow', 'orange']
            }]
        },
        options: {
            legend: {
                display: false
            },
            tooltips: {
                enabled: true
            },
            title: {
                display: true,
                text: `TOTAL: ${data['todayQuantity']}`
            },
            scales: {
                xAxes: [{
                    ticks: { 
                        fixedStepSize: 5.0, 
                        min: 0
                    }
                }],
            }
        }
    }); 
}

function getAllActivesTrip({data}){
    Object.keys(data).map(item => {  
        let element = document.getElementById(item)
        element.innerHTML = ''
        data[item].sort((a,b)=>{ 
            return parseFloat(b.totalPrice.replace(/,/g,"")) - parseFloat(a.totalPrice.replace(/,/g,""));
        }) 
        if(element !== null){
            data[item].map((res,i) => {
                console.log(i)
                let medalha = ''
                if(i === 0)
                    medalha = 'gold'
                if(i === 1)
                    medalha = 'silver'
                if(i > 2)
                    medalha = 'bronze'
                element.innerHTML += `
                <div class="block-ranking-driver">
                       <span value='${res.name}'><i class="fas fa-star ${medalha}"></i> ${reduceTextByChars(res.name, 20)}</span>
                       <span>${numberToReal(parseFloat(res.totalPrice.replace(/,/g,"")))}</span>
                </div>
                `
            }) 
        } 
    })     
}
 
function updateDashboard(){
    return Promise.all([
        DashboardController.getQuantitiesTrip(),  
        DashboardController.currentQuantities(),
        DashboardController.getAllActivesTrip()
    ]).then(data=>{
        getQuantitiesTrip(data[0]), 
        currentQuantities(data[1]),
        getAllActivesTrip(data[2]),
        setTimeout(updateDashboard,TIME)
    }).catch(()=>{ 
        setTimeout(updateDashboard,TIME)
    }); 
}

updateDashboard();

