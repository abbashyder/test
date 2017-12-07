jQuery.extend( jQuery.fn.dataTableExt.oSort, {
    "currency-pre": function ( a ) {
        a = (a==="-") ? 0 : a.replace( /[^\d\-\.]/g, "" );
        return parseFloat( a );
    },

    "currency-asc": function ( a, b ) {
        return a - b;
    },

    "currency-desc": function ( a, b ) {
        return b - a;
    }
} );

$(document).ready(function() {
  $('#marketTable').DataTable({
    "columnDefs": [
      { "type": "currency", targets: [3, 5] }
    ]
  });
} );

$(document).ready(function() {
  $('#example1').DataTable();
  columnDefs: [
    { "type": "currency", targets: [4, 6] }
  ]
} );

$(document).ready(function() {
  $('#example2').DataTable({
    columnDefs: [
      { "type": "currency", targets: 3 },
      { targets: [8], orderable: false}
    ]
  });
} );

$(document).ready(function() {
  $('#example3').DataTable({
    columnDefs: [
      { "type": "currency", targets: 3 },
      { targets: [8], orderable: false}
    ]
  });
} );

$(document).ready(function() {
  $('#example4').DataTable({
    columnDefs: [
      { "type": "currency", targets: [3, 4] }
    ]
  });
} );

var windowLoc = $(location).attr('pathname');
var coinLoc = /^\/market\/[a-z]+/.test(windowLoc);
var btcLoc = /^\/market\/bitcoin/.test(windowLoc);
var altLoc = /^\/market\/(?!bitcoin)[a-z]+/.test(windowLoc);
var addexLoc = /^\/addExchange/.test(windowLoc);

$("#trans").on('click', function (){
  $.ajax({
    async: false,
    url: '/exchangeList',
    type: 'get',
    dataType: 'jsonp',
    success: function (data) {
      if (data.length == 0) {
        $("#trans").attr("href", "#");
        $('#exchangeHeader2Modal').modal('show');
      } else if (data.length == 1) {
        $("#trans").attr("href", "#");
        $('#exchangeHeader1Modal').modal('show');
      } else {
        $("#trans").attr("href", "/transfers");
      }
    }
  });
})

if (windowLoc == '/market' || windowLoc == '/portfolio' || coinLoc == true || windowLoc == '/addFiat' || windowLoc == '/settings' || windowLoc == '/addCoin') {
  getCurrencyRate ();
}

if (windowLoc == '/market' || windowLoc == '/portfolio' || coinLoc == true) {
  $('.price_btc_numbers').each(function () {
    var item = $(this).text();
    if (item == "") {
      var value = (0.00000000).toFixed(15);
      $(this).text(value);
    } else if (Number(item) < 0.00000001) {
      var value = parseFloat(item).toFixed(15);
      $(this).text(value);
    } else {
      var value = parseFloat(item).toFixed(8)
      $(this).text(value);
    }
  })
}

if (windowLoc == '/addFiat') {
  // $(".new-coin-container").on('click', '#amount', function() {
  //   var exchange = $("#exchange").val();
  //   var feePercent = $("#add-ex-fee-percent").val()
  //   var feeTotal = $("#ex-fee-total").val();
  //   if (exchange == null) {
  //     $('#exchangeModal').modal('show');
  //   } else if (feePercent == '-' && feeTotal == '') {
  //     $('#feeModal').modal('show');
  //   } else if ((feePercent || feeTotal) == '') {
  //     $('#feeOrtotalModal').modal('show');
  //   }
  // })
  // $(".new-coin-container").on('click', '#total', function() {
  //   var exchange = $("#exchange").val();
  //   var feePercent = $("#add-ex-fee-percent").val()
  //   var feeTotal = $("#ex-fee-total").val();
  //   if (exchange == null) {
  //     $('#exchangeModal').modal('show');
  //   } else if (feePercent == '-' && feeTotal == '') {
  //     $('#feeModal').modal('show');
  //   } else if ((feePercent || feeTotal) == '') {
  //     $('#feeOrtotalModal').modal('show');
  //   }
  // })
  // $(".new-coin-container").on('input', '#amount', function () {
  //   var amount = $(this).val();
  //   var feePercent = $("#add-ex-fee-percent").val();
  //   var feeTotal = $("#ex-fee-total").val();
  //   if (feePercent == '-') {
  //     var total = Number(amount) + Number(feeTotal);
  //     $("#total").val(total);
  //   } else if (feePercent != '') {
  //     var rex = feePercent.split(/\b(\d+\.\d+)\b/);
  //     var rex1 = feePercent.split(/\b(\d+[\.|\d+]\d+)\b/);
  //     console.log(rex[1] + " " + rex1[0]);
  //     feePercent = rex[1] / 100;
  //     var totalFee = amount * feePercent;
  //     var total = Number(amount) + totalFee;
  //     $("#ex-fee-total").val(totalFee);
  //     $("#total").val(total);
  //   }
  // })
  // $(".new-coin-container").on('input', '#add-ex-fee-percent', function () {
  //   if ($(this).val() == '') {
  //     $("#ex-fee-total").attr("readonly", false);
  //   } else {
  //     $("#ex-fee-total").attr("readonly", true);
  //   }
  // })
  // $(".new-coin-container").on('input', '#ex-fee-total', function () {
  //   if ($(this).val() == '') {
  //     $("#add-ex-fee-percent").val('');
  //     $("#add-ex-fee-percent").attr("readonly", false);
  //   } else {
  //     $("#add-ex-fee-percent").attr("readonly", true);
  //     $("#add-ex-fee-percent").val('-');
  //   }
  // })
  // $(".new-coin-container").on('change', '#exchange', function () {
  //   // console.log("lol");
  //   var name = $(this).val();
  //   var feePercent = 0;
  //   $.ajax({
  //     async: false,
  //     url: '/findExchange',
  //     type: 'get',
  //     data: {
  //       name: name
  //     },
  //     dataType: 'jsonp',
  //     success: function (data) {
  //       // console.log(data[0]);
  //       if (data[0].tradingFeePercent > 0) {
  //         $("#add-ex-fee-percent").val(data[0].tradingFeePercent + "%");
  //         $("#add-ex-fee-percent").attr("readonly", true);
  //         $("#ex-fee-total").attr("readonly", true);
  //         // console.log("not 0");
  //       } else if (data[0].tradingFeePercent == 0 && data[0].tradingFeeBtc == 0) {
  //         // console.log("both zero");
  //         $("#add-ex-fee-percent").attr("readonly", false);
  //         $("#ex-fee-total").attr("readonly", false);
  //         $("#ex-fee-total").attr("placeholder", "Total Fee");
  //         $("#add-ex-fee-percent").attr("placeholder", "Fee%");
  //         $("#add-ex-fee-percent").val("");
  //         $("#ex-fee-total").val("");
  //       } else if (data[0].tradingFeePercent == 0) {
  //         // console.log("0");
  //         $("#add-ex-fee-percent").attr("readonly", true);
  //         $("#ex-fee-total").attr("readonly", false);
  //         $("#add-ex-fee-percent").val('-');
  //         $("#ex-fee-total").attr("placeholder", "Total Fee");
  //         $("#ex-fee-total").val('');
  //       }
  //     }
  //   });
  // })
}

if (addexLoc == true) {
  $("#add-exchange-form").submit(function (event) {
    var name = $("#exchange-name").val();
    $.ajax({
      async: false,
      url: '/exchangeList',
      type: 'get',
      dataType: 'jsonp',
      success: function (data) {
        for (var i = 0; i < data.length; i++) {
          if ((data[i].exchange).toUpperCase() == name.toUpperCase()) {
            $('#sameExchangeModal').modal('show');
            event.preventDefault();
            break;
          }
        }
      }
    });
  })
}

if (windowLoc == '/settings') {
  $.ajax({
    url: '/exchangeList',
    type: 'get',
    dataType: 'jsonp',
    success: function (exchangeList) {
      // console.log(exchangeList);
      $("#add-fiat-settings").submit(function(event) {
        var exFiat = 0;
        var exBtc = 0;
        if (exchangeList.length == 0) {
          event.preventDefault();
          $('#exchangeModal').modal('show');
        } else {
          for (var i = 0; i < exchangeList.length; i++) {
            if (exchangeList[i].type == 'btc-alt') {
              exBtc += 1;
            } else {
              exFiat += 1;
            }
          }
          // console.log(exFiat);
          // console.log(exBtc);
          if (exFiat == 0) {
            event.preventDefault();
            $('#exchangeModal').modal('show');
          }
        }
      })
    }
  })
}

if (windowLoc == '/market') {
  $('.market_percent_change').each(function () {
    var item = parseFloat($(this).text());
    if (item < 0 || item > 0) {
      item = item + " %";
    } else if (item == 0 || isNaN(item)) {
      item = "-";
    };
    $(this).text(item);
  })
}

if (coinLoc == true) {
  $('.percentage_numbers').each(function () {
    var item = $(this).text().toLocaleString('en');
    if (Number(item) < 0) {
      $(this).addClass('negPercentage');
      $(this.previousElementSibling).addClass('fa-arrow-down');
    }else{
      $(this).addClass('posPercentage');
      $(this.previousElementSibling).addClass('fa-arrow-up');
    }
  });
  $("#add-coin-to-portfolio").on('click', function () {
    if (coinName == 'Bitcoin') {
      $.ajax({
        url: '/exchangeList',
        type: 'get',
        dataType: 'jsonp',
        success: function (exchangeList) {
          var fiatEx = 0;
          var btcEx = 0;
          for (var i = 0; i < exchangeList.length; i++) {
            if (exchangeList[i].type == 'fiat-btc') {
              fiatEx += 1;
            } else {
              btcEx += 1;
            }
          }
          if (exchangeList.length == 0 || fiatEx == 0) {
            window.location.href = "/addExchange";
          } else {
            $.ajax({
              url: '/checkFiatUnits',
              type: 'get',
              dataType: 'jsonp',
              success: function (data) {
                if (data <= 0) {
                  // alert("You have no money to buy BTC!!! Please add Fiat to the portfolio.");
                  window.location.href = "/addFiat";
                } else {
                  window.location.href = "/addCoin?price_btc="+priceBtc+"&name="+coinName+"&price_fiat="+priceFiat+"&symbol="+coinSymbol+"";
                }
              }
            });
          }
        }
      })
    } else {
      $.ajax({
        url: '/checkBtcUnits',
        type: 'get',
        dataType: 'jsonp',
        success: function (data) {
          $.ajax({
            url: '/exchangeList',
            type: 'get',
            dataType: 'jsonp',
            success: function (exchangeList) {
              var fiatEx = 0;
              var btcEx = 0;
              for (var i = 0; i < exchangeList.length; i++) {
                if (exchangeList[i].type == 'fiat-btc') {
                  fiatEx += 1;
                } else {
                  btcEx += 1;
                }
              }
              if (exchangeList.length == 0 || btcEx == 0) {
                window.location.href = "/addExchange";
              } else {
                if (data <= 0) {
                  window.location.href = "/market/bitcoin";
                } else {
                  $.ajax({
                    url: '/checkExchangeUnits',
                    type: 'get',
                    data: {
                      name: 'Bitcoin',
                      exchange: 'Bittrex'
                    },
                    dataType: 'jsonp',
                    success: function (data) {
                      if (data > 0) {
                        window.location.href = "/addCoin?price_btc="+priceBtc+"&name="+coinName+"&price_fiat="+priceFiat+"&symbol="+coinSymbol+"";
                      } else {
                        window.location.href = "/transfers";
                      }
                    }
                  });
                }
              }
            }
          })
        }
      });
    }
  })
}

if (btcLoc == true || altLoc == true) {
  checkUnits ();
}

if (windowLoc == '/addCoin') {
  var fees = 0;
  var feePercent = '0%';
  $(".new-coin-container").on('change', '#portfolio-exchange', function () {
    var name = $(this).val();
    $("#units").val("");
    $("#total-fiat").val("");
    $("#total-btc").val("");
    $.ajax({
      async: false,
      url: '/findExchange',
      type: 'get',
      data: {
        name: name
      },
      dataType: 'jsonp',
      success: function (data) {
        // console.log(data[0]);
        if (data[0].tradingFeePercent == 0) {
          $("#fee").attr("readonly", false);
          $("#add-fee-percent").attr("readonly", false);
          $("#add-fee-percent").val("")
          $("#fee").val("")
        } else {
          $("#add-fee-percent").attr("readonly", true);
          $("#fee").attr("readonly", true);
          $("#add-fee-percent").val(data[0].tradingFeePercent + "%")
          $("#fee").val("")
        }
      }
    });
  })
  $(".new-coin-container").on('click', '#units', function() {
    var exchange = $("#portfolio-exchange").val();
    var order = $("#order:checked").val();
    var feePercent = $("#add-fee-percent").val();
    var feeTotal = $("#fee").val();
    if (exchange == null && order == undefined) {
      $('#exchangeOrderModal').modal('show');
    } else if (exchange != null && order == undefined) {
      $('#orderModal').modal('show');
    } else if (exchange == null && order != undefined) {
      $('#exchangeModal').modal('show');
    }
    if ((exchange != null && order != undefined) && feePercent == '') {
      $('#addFeeModal').modal('show');
    }
  })
  $(".new-coin-container").on('click', '#add-price-fiat', function() {
    var exchange = $("#portfolio-exchange").val();
    var units = $("#units").val();
    if (exchange == null && units == '') {
      $('#exchangeModal').modal('show');
    }
    if (exchange != null && units == '') {
      // console.log("lol");
      $('#exchangePriceModal').modal('show');
    }
  })
}

// function validateForm() {
//   console.log("lol");
// }

if (windowLoc == '/portfolio') {
  $(function () {
    $.ajax({
        url: '/checkBtcUnits',
        type: 'get',
        dataType: 'jsonp',
        success: function (data) {
          if (data <= 0) {
            $("#btc-value").text((data).toFixed(8));
          } else {
            $("#btc-value").text((data).toFixed(8));
          }
        }
    });
  })
  $(function () {
    var sum = 0;
    var btc = 0;
    var alt = 0;
    $.ajax({
        url: '/checkBtcUnits',
        type: 'get',
        dataType: 'jsonp',
        success: function (data) {
          // console.log(data);
          if (data < 0.00000001) {
            data = (Number(0)).toFixed(8);
            $("#amount-btc").text(data);
          } else {
            data = data.toFixed(8);
            $("#amount-btc").text(data);
          }
        }
    });
  })
  $(function () {
    $.ajax({
        url: '/checkAltPrice',
        type: 'get',
        dataType: 'jsonp',
        success: function (data) {
          data = data.toFixed(8);
          $("#amount-btc-alt").text(data);
        }
    });
  })
  $(function () {
    $.ajax({
      url: '/checkBtcUnits',
      type: 'get',
      dataType: 'jsonp',
      success: function (data) {
        var btc = data;
        var sum = 0;
        $.ajax({
          url: '/checkAltPrice',
          type: 'get',
          dataType: 'jsonp',
          success: function (data1) {
            sum = data + data1;
            // console.log(sum);
            if (sum < 0.00000001) {
              sum = (Number(0)).toFixed(8);
              $("#portfolio-btc").text(sum);
            } else {
              sum = sum.toFixed(8);
              $("#portfolio-btc").text(sum);
            }
          }
        });
      }
    });
  })
  $(".portfoio-buy-id").each(function () {
    var id = $(this).text();
    var formatDate = $(this.parentElement.children[7]);
    $.ajax({
      url: '/checkBuyOrders',
      type: 'get',
      data: {
        coin: id
      },
      dataType: 'jsonp',
      success: function (buyData) {
        if (buyData[0].time == '') {
          var date = buyData[0].date;
          var newDate = new Date(date);
          newDate = newDate.toUTCString();
          var regDate = newDate.split(/\b(\w+\,\ \d+\ \w+\ \d+)\b/);
          formatDate.text(regDate[1]);
        } else {
          var date = buyData[0].date;
          var time = buyData[0].time;
          var newDate = new Date(date);
          newDate = newDate.toUTCString();
          var regDate = newDate.split(/\b(\w+\,\ \d+\ \w+\ \d+)\b/);
          formatDate.text(regDate[1] + ", " + time);
        }
      }
    });
  })
  $(".portfoio-sell-id").each(function () {
    var id = $(this).text();
    var formatDate = $(this.parentElement.children[7]);
    $.ajax({
      url: '/checkSellOrders',
      type: 'get',
      data: {
        coin: id
      },
      dataType: 'jsonp',
      success: function (sellData) {
        if (sellData[0].time == '') {
          var date = sellData[0].date;
          var newDate = new Date(date);
          newDate = newDate.toUTCString();
          var regDate = newDate.split(/\b(\w+\,\ \d+\ \w+\ \d+)\b/);
          formatDate.text(regDate[1]);
        } else {
          var date = sellData[0].date;
          var time = sellData[0].time;
          var newDate = new Date(date);
          newDate = newDate.toUTCString();
          var regDate = newDate.split(/\b(\w+\,\ \d+\ \w+\ \d+)\b/);
          formatDate.text(regDate[1] + ", " + time);
        }
      }
    });
  })
  $("#portfolio-btc-units").each(function () {
    var formattedUnits = parseFloat($(this).text());
    formattedUnits = formattedUnits.toFixed(8);
    $(this).text(formattedUnits);
  })
  $(".btc-pl-alt").each(function () {
    var alt = $(this.parentElement.children[0]).text();
    var altPl = $(this);
    // console.log(alt);
    // console.log(altPl);
    $.ajax({
      url: '/checkAltBtcPl',
      type: 'get',
      data: {
        coin: alt
      },
      dataType: 'jsonp',
      success: function (data) {
        data = data.toFixed(8);
        altPl.text(data);
      }
    });
  })
  $("#total-pl-btc").each(function () {
    var totalBtcPl = $(this);
    var totalPl = 0;
    var displayPl = 0;
    $.ajax({
      url: '/checkAltPrice',
      type: 'get',
      dataType: 'jsonp',
      success: function (data) {
        // console.log(data);
        if (data == 0) {
          $.ajax({
            url: '/checkBtcBuyOrders',
            type: 'get',
            data: {
              coin: 'Bitcoin'
            },
            dataType: 'jsonp',
            success: function (btcData) {
              var totalInvestedUnits = 0;
              for (var i = 0; i < btcData.length; i++) {
                totalInvestedUnits += btcData[i].units;
              }
              $.ajax({
                url: '/checkBtcSellOrders',
                type: 'get',
                data: {
                  coin: 'Bitcoin'
                },
                dataType: 'jsonp',
                success: function (btcData) {
                  var totalSoldUnits = 0;
                  for (var i = 0; i < btcData.length; i++) {
                    totalSoldUnits += btcData[i].units;
                  }
                  $.ajax({
                    url: '/checkBtcUnits',
                    type: 'get',
                    dataType: 'jsonp',
                    success: function (btcHoldData) {
                      var totalHoldUnits = btcHoldData;
                      var totalBtcDisplayPl = (totalSoldUnits + totalHoldUnits) - totalInvestedUnits;
                      // console.log(totalBtcDisplayPl);
                      if (totalBtcDisplayPl < 0.00000001) {
                        displayPl = (Number(0)).toFixed(8);
                        totalBtcPl.text(displayPl);
                      } else {
                        displayPl = totalBtcDisplayPl.toFixed(8);
                        totalBtcPl.text(displayPl);
                      }
                    }
                  });
                }
              });
            }
          });
        } else {
          $(".btc-pl-alt").each(function () {
            var alt = $(this.parentElement.children[0]).text();
            var altPl = $(this);
            $.ajax({
              url: '/checkAltBtcPl',
              type: 'get',
              data: {
                coin: alt
              },
              dataType: 'jsonp',
              success: function (altData) {
                totalPl += altData;
                displayPl = totalPl.toFixed(8);
                totalBtcPl.text(displayPl);
              }
            });
          })
        }
      }
    });
  })
  $(".fiat-buy-amount").each(function () {
    var amount = $(this).text();
    var newAmount = amount.split(/\b(\d+)\b/);
    var newNewAmount = (Number(newAmount[1])).toLocaleString('en');
    $(this).text(newAmount[0] + newNewAmount);
  })
  $(function () {
    $.ajax({
      url: '/getRates',
      type: 'get',
      dataType: 'jsonp',
      success: function (data) {
        $(".fiat-buy-usd-amount").each(function () {
          var symbol = $(this.parentElement.children[1]).text();
          var newSymbol = symbol.split(/\b(^.{0,3})\b/);
          if (newSymbol[1] == 'CAD') {
            var amount = $(this).text();
            var usdAmount = (amount / data.CAD).toFixed(2);
            var newAmount = (Number(usdAmount)).toLocaleString('en');
            $(this).text("$" + newAmount);
          } else if (newSymbol[1] == 'EUR') {
            var amount = $(this).text();
            var usdAmount = (amount / data.EUR).toFixed(2);
            var newAmount = (Number(usdAmount)).toLocaleString('en');
            $(this).text("$" + newAmount);
          } else if (newSymbol[1] == 'ZAR') {
            var amount = $(this).text();
            var usdAmount = (amount / data.ZAR).toFixed(2);
            var newAmount = (Number(usdAmount)).toLocaleString('en');
            $(this).text("$" + newAmount);
          } else if (newSymbol[1] == 'NZD') {
            var amount = $(this).text();
            var usdAmount = (amount / data.NZD).toFixed(2);
            var newAmount = (Number(usdAmount)).toLocaleString('en');
            $(this).text("$" + newAmount);
          } else if (newSymbol[1] == 'MXN') {
            var amount = $(this).text();
            var usdAmount = (amount / data.MXN).toFixed(2);
            var newAmount = (Number(usdAmount)).toLocaleString('en');
            $(this).text("$" + newAmount);
          } else if (newSymbol[1] == 'JPY') {
            var amount = $(this).text();
            var usdAmount = (amount / data.JPY).toFixed(2);
            var newAmount = (Number(usdAmount)).toLocaleString('en');
            $(this).text("$" + newAmount);
          } else if (newSymbol[1] == 'INR') {
            var amount = $(this).text();
            var usdAmount = (amount / data.INR).toFixed(2);
            var newAmount = (Number(usdAmount)).toLocaleString('en');
            $(this).text("$" + newAmount);
          } else if (newSymbol[1] == 'HKD') {
            var amount = $(this).text();
            var usdAmount = (amount / data.HKD).toFixed(2);
            var newAmount = (Number(usdAmount)).toLocaleString('en');
            $(this).text("$" + newAmount);
          } else if (newSymbol[1] == 'GBP') {
            var amount = $(this).text();
            var usdAmount = (amount / data.GBP).toFixed(2);
            var newAmount = (Number(usdAmount)).toLocaleString('en');
            $(this).text("$" + newAmount);
          } else if (newSymbol[1] == 'CNY') {
            var amount = $(this).text();
            var usdAmount = (amount / data.CNY).toFixed(2);
            var newAmount = (Number(usdAmount)).toLocaleString('en');
            $(this).text("$" + newAmount);
          } else if (newSymbol[1] == 'CHF') {
            var amount = $(this).text();
            var usdAmount = (amount / data.CHF).toFixed(2);
            var newAmount = (Number(usdAmount)).toLocaleString('en');
            $(this).text("$" + newAmount);
          } else if (newSymbol[1] == 'AUD') {
            var amount = $(this).text();
            var usdAmount = (amount / data.AUD).toFixed(2);
            var newAmount = (Number(usdAmount)).toLocaleString('en');
            $(this).text("$" + newAmount);
          } else if (newSymbol[1] == 'USD') {
            var amount = $(this).text();
            var usdAmount = (amount / 1).toFixed(2);
            var newAmount = (Number(usdAmount)).toLocaleString('en');
            $(this).text("$" + newAmount);
          }
        })
      }
    });
  })
  $(".fiat-buy-date").each(function () {
    var formatDate = $(this).text();
    var regDate = formatDate.split(/\b(\w+\,\ \d+\ \w+\ \d+)\b/);
    $(this).text(regDate[1]);
  })
}

if (windowLoc == '/transfers') {
  $(".new-coin-container").on('click', '#transfer-units', function () {
    var exchange = $('#from-exchange').val();
    var fee = $("#transfer-fee").val();
    if (exchange == null && fee == '') {
      $('#exchangeModal').modal('show');
    } else if (exchange != null && fee == '') {
      $('#addFeeModal').modal('show');
    }
  })

  $(".new-coin-container").on('click', '#transfer-fee', function () {
    var exchange = $('#from-exchange').val();
    if (exchange == null) {
      $('#exchangeModal').modal('show');
    }
  })

  $(".new-coin-container").on('click', '#transfer-total', function () {
    var exchange = $('#from-exchange').val();
    var fee = $("#transfer-fee").val();
    if (exchange == null && fee == '') {
      $('#exchangeModal').modal('show');
    } else if (exchange != null && fee == '') {
      $('#addFeeModal').modal('show');
    }
  })

  // $(".new-coin-container").on('click', '#to-exchange', function () {
  //   var exchange = $('#from-exchange').val();
  //   if (exchange == null) {
  //     $('#exchangeModal').modal('show');
  //   }
  // })

  $(".new-coin-container").on('change', "#from-exchange", function () {
    var name = 'Bitcoin';
    var exchange = $(this).val();
    $.ajax({
      async: false,
      url: '/findExchange',
      type: 'get',
      data: {
        name: exchange
      },
      dataType: 'jsonp',
      success: function (data) {
        // console.log(data[0].transferFeeBtc);
        if (data[0].transferFeeBtc == 0) {
          $("#transfer-fee").attr("readonly", false);
          $("#transfer-fee").val("")
        } else {
          $("#transfer-fee").attr("readonly", true);
          $("#transfer-fee").val((parseFloat(data[0].transferFeeBtc)).toFixed(8));
        }
      }
    });
    $.ajax({
      url: '/checkExchangeUnits',
      type: 'get',
      data: {
        name: name,
        exchange: exchange
      },
      dataType: 'jsonp',
      success: function (data) {
        if (data == 0) {
          $("#btcUnitsHelp").text(0);
        } else {
          $("#btcUnitsHelp").text((parseFloat(data)).toFixed(8));
        }
        // console.log(data);
        // if (total > data) {
        //   $('#lessBtcModal').modal('show');
        // }
      }
    });
    // var units = $("#transfer-total").val();
    // var fee = 0;
    // if (exchange == 'Bittrex') {
    //   fee = (0.00050000).toFixed(8);
    //   $("#transfer-fee").attr("readonly", true);
    //   $("#transfer-fee").val(fee);
    // } else {
    //   $("#transfer-fee").val('');
    //   $("#transfer-fee").attr("readonly", false);
    // }
    // $.ajax({
    //   url: '/checkExchangeUnits',
    //   type: 'get',
    //   data: {
    //     name: name,
    //     exchange: exchange
    //   },
    //   dataType: 'jsonp',
    //   success: function (data) {
    //     // console.log(typeof(data));
    //     data = (Number(data)).toFixed(8);
    //     $("#transfer-units").val(data);
    //     var total = Number(data) + Number(fee);
    //     total = total.toFixed(8);
    //     $("#transfer-total").val(total)
    //     // if (total > data) {
    //     //   $('#lessBtcModal').modal('show');
    //     // }
    //   }
    // });
  })

  $(".new-coin-container").on('input', '#transfer-units', function () {
    var name = 'Bitcoin';
    var exchange = $('#from-exchange').val();
    var units = parseFloat($(this).val());
    var fee = parseFloat($('#transfer-fee').val());
    var total = units + fee;
    total = total.toFixed(8);
    $.ajax({
      url: '/checkExchangeUnits',
      type: 'get',
      data: {
        name: name,
        exchange: exchange
      },
      dataType: 'jsonp',
      success: function (data) {
        if (total > data) {
          $('#lessBtcModal').modal('show');
        }
      }
    });
    $('#transfer-total').val(total);

  })

  $(".new-coin-container").on('input', '#transfer-fee', function () {
    var name = 'Bitcoin';
    var exchange = $('#from-exchange').val();
    var fee = parseFloat($(this).val());
    var units = parseFloat($('#transfer-units').val());
    var total = units + fee;
    total = total.toFixed(8);
    $('#transfer-total').val(total);
    $.ajax({
      url: '/checkExchangeUnits',
      type: 'get',
      data: {
        name: name,
        exchange: exchange
      },
      dataType: 'jsonp',
      success: function (data) {
        if (total > data) {
          $('#lessBtcModal').modal('show');
        }
      }
    });
  })

  $(".new-coin-container").on('input', '#transfer-total', function () {
    var name = 'Bitcoin';
    var exchange = $('#from-exchange').val();
    var fee = parseFloat($('#transfer-fee').val());
    var total = parseFloat($(this).val());
    var units = total - fee;
    units = units.toFixed(8);
    $('#transfer-units').val(units);
    $.ajax({
      url: '/checkExchangeUnits',
      type: 'get',
      data: {
        name: name,
        exchange: exchange
      },
      dataType: 'jsonp',
      success: function (data) {
        if (total > data) {
          $('#lessBtcModal').modal('show');
        }
      }
    });
  })
  $("#transfer-coin-form").submit(function (event) {
    var name = 'Bitcoin';
    var fromExchange = $("#from-exchange").val();
    var toExchange = $("#to-exchange").val();
    var total = $("#transfer-total").val();
    if (fromExchange == toExchange) {
      $('#sameExchangeModal').modal('show');
      event.preventDefault();
    } else if (fromExchange != toExchange) {
      $.ajax({
        url: '/checkExchangeUnits',
        type: 'get',
        data: {
          name: name,
          exchange: fromExchange
        },
        dataType: 'jsonp',
        success: function (data) {
          if (total > data) {
            $('#lessBtcModal').modal('show');
            event.preventDefault();
          }
        }
      });
    }
  })
}

$(".new-coin-container").on('click', '#exchange-fee-percent', function() {
  var order = $("#type:checked").val();
  if (order == undefined) {
    $('#orderTypeModal').modal('show');
  }
})

$(".new-coin-container").on('click', '#exchange-fee-btc', function() {
  var order = $("#type:checked").val();
  if (order == undefined) {
    $('#orderTypeModal').modal('show');
  }
})

$(".new-coin-container").on('click', '#exchange-transfer-fee-percent', function() {
  var order = $("#type:checked").val();
  if (order == undefined) {
    $('#orderTypeModal').modal('show');
  }
})

$(".new-coin-container").on('click', '#exchange-transfer-fee-btc', function() {
  var order = $("#type:checked").val();
  if (order == undefined) {
    $('#orderTypeModal').modal('show');
  }
})

$(".new-coin-container").on('input', '#exchange-fee-percent', function () {
  var value = $(this).val();
  if (value == '') {
    $("#exchange-fee-btc").attr("readonly", false);
  } else {
    $("#exchange-fee-btc").attr("readonly", true);
  }
})

$(".new-coin-container").on('input', '#exchange-fee-btc', function () {
  var value = $(this).val();
  if (value == '') {
    $("#exchange-fee-percent").attr("readonly", false);
  } else {
    $("#exchange-fee-percent").attr("readonly", true);
  }
})

$(".new-coin-container").on('input', '#exchange-transfer-fee-percent', function () {
  var value = $(this).val();
  if (value == '') {
    $("#exchange-transfer-fee-btc").attr("readonly", false);
  } else {
    $("#exchange-transfer-fee-btc").attr("readonly", true);
  }
})

$(".new-coin-container").on('input', '#exchange-transfer-fee-btc', function () {
  var value = $(this).val();
  if (value == '') {
    $("#exchange-transfer-fee-percent").attr("readonly", false);
  } else {
    $("#exchange-transfer-fee-percent").attr("readonly", true);
  }
})

function getCurrencyRate (){
  $.ajax({
    url: '/getExchangeRate',
    method: 'GET',
    dataType: 'jsonp',
    success: function (data) {
      var name = data.currencyName;
      var fiatName = name.split(/[-]+/);
      var symbol = data.currencySymbol;
      var show = data.currencyShow
      var rate = data.rate;
      $("#currency").val(name);
      $("#fiat-currency").val(fiatName[0]);
      $("#fiat-symbol").val(symbol);
      $("#fee-buy-fiat").text("Fee " + symbol);
      $("#fiat-show").val(show);
      $("#portfoio-value-show").text("Portfolio Value (" + show + ")");
      $("#portfoio-fiat-show").text("Available Fiat (" + show + ")");
      $("#portfoio-total-pl-show").text("Total Profit/Loss (" + show + ")");
      $("#portfoio-current-fiat").text("Current Price (" + show + ")");
      $("#portfoio-pl-fiat").text("Profit/Loss (" + show + ")");
      $("#price-label").text("Price (" + symbol + ")");
      $("#total-label").text("Total (" + symbol + ")");
      var priceFiat = $("#add-price-fiat").val();
      var newPrice = (priceFiat * rate).toFixed(2);
      $("#add-price-fiat").val(newPrice);
      $(function () {
        $.ajax({
            url: '/checkFiatUnits',
            type: 'get',
            dataType: 'jsonp',
            success: function (data) {
              data = data * rate;
              data = data.toFixed(2);
              var newData = Number(data).toLocaleString('en');
              $("#fiat-value").text(show + newData);
            }
        });
      })
      $("#add-coin-form").submit(function(event) {
        var name = $('#name').val();
        var exchange = $('#portfolio-exchange').val();
        var order = $("#order:checked").val();
        var units = $('#units').val();
        var totalFiat = $('#total-fiat').val();
        var totalBtc = $('#total-btc').val();
        var usdRate = 1 / rate;
        var usdPrice = totalFiat * usdRate;
        var status = '';
        // console.log(name + " " + exchange + " " + order + " " + totalFiat + " " + totalBtc + " " + usdRate + " " + usdPrice);
        if (name == 'Bitcoin' && order == 'buy') {
          $.ajax({
            async: false,
            url: '/checkExchangeUnits',
            type: 'get',
            dataType: 'jsonp',
            data: {
              name: 'Fiat (USD)',
              exchange: exchange
            },
            success: function (data) {
              if (usdPrice > data) {
                $('#lessFiatModal').modal('show');
                event.preventDefault();
              }
            }
          })
        } else if (name != 'Bitcoin' && order == 'buy') {
          $.ajax({
            async: false,
            url: '/checkExchangeUnits',
            type: 'get',
            dataType: 'jsonp',
            data: {
              name: 'Bitcoin',
              exchange: exchange
            },
            success: function (data) {
              if (totalBtc > data) {
                $('#lessBtcAltBuyModal').modal('show');
                event.preventDefault();
              }
            }
          })
        } else if (name == 'Bitcoin' && order == 'sell') {
          $.ajax({
            async: false,
            url: '/checkExchangeUnits',
            type: 'get',
            dataType: 'jsonp',
            data: {
              name: 'Bitcoin',
              exchange: exchange
            },
            success: function (data) {
              // console.log(totalBtc);
              // console.log(data);
              if (totalBtc > data) {
                $('#lessFiatModal').modal('show');
                event.preventDefault();
              }
            }
          })
        } else if (name != 'Bitcoin' && order == 'sell') {
          $.ajax({
            async: false,
            url: '/checkExchangeUnits',
            type: 'get',
            dataType: 'jsonp',
            data: {
              name: name,
              exchange: exchange
            },
            success: function (data) {
              if (units > data) {
                $('#lessFiatModal').modal('show');
                event.preventDefault();
              }
            }
          })
        }
      });
      $(".new-coin-container").on('input', '#add-fee-percent', function (){
        if ($(this).val() == '') {
          $("#fee").attr("readonly", false);
          $("#fee").val('');
        } else {
          $("#fee").attr("readonly", true);
        }
      })
      $(".new-coin-container").on('input', '#fee', function (){
        if ($(this).val() == '') {
          $("#add-fee-percent").val('')
          $("#add-fee-percent").attr("readonly", false);
        } else {
          $("#add-fee-percent").val('-')
          $("#add-fee-percent").attr("readonly", true);
        }
      })
      $(".new-coin-container").on('input', '#units', function(){
        var name = $("#name").val();
        var exchange = $("#portfolio-exchange").val();
        var order = $("#order:checked").val();
        var units = parseFloat($(this).val());
        var priceBtc = parseFloat($("#price-btc").val());
        var priceFiat = parseFloat($("#add-price-fiat").val());
        var feePercent = $("#add-fee-percent").val();
        var feeTotal = $("#fee").val();
        var totalFiatDisplay = units * priceFiat;
        var totalBtcDisplay = units * priceBtc;
        if (feePercent == "" && feeTotal == "") {
          $('#addFeeModal').modal('show');
        } else {
          if (name == 'Bitcoin') {
            if (feePercent == "-") {
              var feeFiat = feeTotal;
              var fiatTotalFees = (parseFloat(feeFiat)).toFixed(2);
              var usdRate = 1 / rate;
              totalFiatDisplay = Number(totalFiatDisplay) + Number(feeFiat);
              totalUsdFiatDisplay = Number(totalFiatDisplay) * usdRate;
              totalFiatDisplay = (parseFloat(totalFiatDisplay)).toFixed(2);
              totalBtcDisplay = (totalBtcDisplay).toFixed(8);
            } else {
              var rex = feePercent.split(/\b(\d+\.\d+)\b/);
              fees = rex[1] / 100;
              if (rex[1] == undefined) {
                fees = rex[0] / 100;
              } else {
                fees = rex[1] / 100;
              }
              var feeFiat = fees * totalFiatDisplay;
              var feeBtc = fees * totalBtcDisplay;
              var btcTotalFees = (feeBtc).toFixed(8);
              var fiatTotalFees = (feeFiat).toFixed(2);
              var usdRate = 1 / rate;
              totalFiatDisplay = totalFiatDisplay + feeFiat;
              totalUsdFiatDisplay = totalFiatDisplay * usdRate;
              totalFiatDisplay = (totalFiatDisplay).toFixed(2);
              totalBtcDisplay = (totalBtcDisplay).toFixed(8);
            }
            if (order == 'buy') {
              $.ajax({
                url: '/checkExchangeUnits',
                type: 'get',
                dataType: 'jsonp',
                data: {
                  name: 'Fiat (USD)',
                  exchange: exchange
                },
                success: function (data) {
                  if (totalUsdFiatDisplay > data) {
                    $('#lessFiatModal').modal('show');
                    $("#fee").val(fiatTotalFees)
                    $("#total-btc").val(totalBtcDisplay);
                    $("#total-fiat").val(totalFiatDisplay);
                  } else {
                    $("#fee").val(fiatTotalFees)
                    $("#total-btc").val(totalBtcDisplay);
                    $("#total-fiat").val(totalFiatDisplay);
                  }
                }
              });
            } else {
              $.ajax({
                url: '/checkExchangeUnits',
                type: 'get',
                data: {
                  name: name,
                  exchange: exchange
                },
                dataType: 'jsonp',
                success: function (data) {
                  // console.log(data);
                  if (totalBtcDisplay > data) {
                    $('#lessBtcModal').modal('show');
                    $("#fee").val(fiatTotalFees)
                    $("#total-btc").val(totalBtcDisplay);
                    $("#total-fiat").val(totalFiatDisplay);
                  } else {
                    $("#fee").val(fiatTotalFees)
                    $("#total-btc").val(totalBtcDisplay);
                    $("#total-fiat").val(totalFiatDisplay);
                  }
                }
              });
            }
          } else {
            if (feePercent == "-") {
              var feeBtc = feeTotal;
              var btcTotalFees = (parseFloat(feeBtc)).toFixed(2);
              var usdRate = 1 / rate;
              totalBtcDisplay = Number(totalBtcDisplay) + Number(feeBtc);
              totalBtcDisplay = (parseFloat(totalBtcDisplay)).toFixed(2);
            } else {
              var rex = feePercent.split(/\b(\d+\.\d+)\b/);
              fees = rex[1] / 100;
              if (rex[1] == undefined) {
                fees = rex[0] / 100;
              } else {
                fees = rex[1] / 100;
              }
              var feeBtc = fees * totalBtcDisplay;
              var feeFiat;
              $.ajax({
                async: false,
                url: '/checkBtcPrice',
                type: 'get',
                dataType: 'jsonp',
                success: function (btcPrice) {
                  feeFiat = feeBtc * btcPrice;
                }
              })
              var btcTotalFees = (feeBtc).toFixed(8);
              var fiatTotalFees =  (feeFiat).toFixed(2);
              totalBtcDisplay = totalBtcDisplay + feeBtc;
              totalFiatDisplay = totalFiatDisplay + feeFiat;
              totalBtcDisplay = (totalBtcDisplay).toFixed(8);
              totalFiatDisplay = (totalFiatDisplay).toFixed(2);
            }
            if (order == 'buy') {
              // console.log("lol");
              $.ajax({
                url: '/checkExchangeUnits',
                type: 'get',
                dataType: 'jsonp',
                data: {
                  name: 'Bitcoin',
                  exchange: exchange
                },
                success: function (data) {
                  if (totalBtcDisplay > data) {
                    $('#lessBtcAltBuyModal').modal('show');
                    $("#fee").val(btcTotalFees)
                    $("#total-btc").val(totalBtcDisplay);
                    $("#total-fiat").val(totalFiatDisplay);
                  } else {
                    $("#fee").val(btcTotalFees)
                    $("#total-btc").val(totalBtcDisplay);
                    $("#total-fiat").val(totalFiatDisplay);
                  }
                }
              });
            } else {
              $.ajax({
                url: '/checkExchangeUnits',
                type: 'get',
                data: {
                  name: name,
                  exchange: exchange
                },
                dataType: 'jsonp',
                success: function (data) {
                  // console.log(data);
                  if (units > data) {
                    $('#lessBtcModal').modal('show');
                    $("#fee").val(totalBtcFees)
                    $("#total-btc").val(totalBtcDisplay);
                    $("#total-fiat").val(totalFiatDisplay);
                  } else {
                    $("#fee").val(totalBtcFees)
                    $("#total-btc").val(totalBtcDisplay);
                    $("#total-fiat").val(totalFiatDisplay);
                  }
                }
              });
            }
          }
        }
      });
      $(".new-coin-container").on('input', '#add-price-fiat', function(){
        var name = $(this.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.lastElementChild).val();
        var exchange = $("#portfolio-exchange").val();
        var priceFiat = $(this).val();
        var priceBtc = $(this.parentElement.nextElementSibling.lastElementChild).val();
        var units = parseFloat($(this.parentElement.previousElementSibling.lastElementChild).val());
        var totalFiat = units * priceFiat;
        var totalBtc = units * priceBtc;
        var order = $("#order:checked").val();
        var feePercent = $("#add-fee-percent").val();
        var feeTotal = $("#fee").val();
        if (feePercent == "" && feeTotal == "") {
          $('#addFeeModal').modal('show');
        } else {
          if (name == 'Bitcoin') {
            if (feePercent == "-")  {
              var btcTotalFee = Number(feeTotal) / Number(priceFiat);
              var fiatTotalFee = Number(feeTotal);
            } else {
              var rex = feePercent.split(/\b(\d+\.\d+)\b/);
              fees = rex[1] / 100;
              if (rex[1] == undefined) {
                fees = rex[0] / 100;
              } else {
                fees = rex[1] / 100;
              }
              var btcTotalFee = fees * totalBtc;
              var fiatTotalFee = fees * totalFiat;
            }
            totalBtc = Number(totalBtc) + btcTotalFee;
            totalFiat = Number(totalFiat) + fiatTotalFee;
            var usdRate = 1 / rate;
            var totalUsdFiat = totalFiat * usdRate;
            btcTotalFee = btcTotalFee.toFixed(8);
            totalBtc = totalBtc.toFixed(8);
            totalFiat = totalFiat.toFixed(2);
            fiatTotalFee = fiatTotalFee.toFixed(2);
            if (order == 'buy') {
              $.ajax({
                url: '/checkExchangeUnits',
                type: 'get',
                dataType: 'jsonp',
                data: {
                  name: 'Fiat (USD)',
                  exchange: exchange
                },
                success: function (data) {
                  if (totalUsdFiat > data) {
                    $('#lessFiatModal').modal('show');
                    $("#fee").val(fiatTotalFee)
                    $("#total-btc").val(units.toFixed(8));
                    $("#total-fiat").val(totalFiat);
                  } else {
                    $("#fee").val(fiatTotalFee)
                    $("#total-btc").val(units.toFixed(8));
                    $("#total-fiat").val(totalFiat);
                  }
                }
              });
            } else {
              $.ajax({
                url: '/checkExchangeUnits',
                type: 'get',
                data: {
                  name: name,
                  exchange: exchange
                },
                dataType: 'jsonp',
                success: function (data) {
                  // console.log(data);
                  if (totalBtc > data) {
                    $('#lessBtcModal').modal('show');
                    $("#fee").val(fiatTotalFee)
                    $("#total-btc").val(units.toFixed(8));
                    $("#total-fiat").val(totalFiat);
                  } else {
                    $("#fee").val(fiatTotalFee)
                    $("#total-btc").val(units.toFixed(8));
                    $("#total-fiat").val(totalFiat);
                  }
                }
              });
            }
          } else {
            if (feePercent == "-")  {
              var btcTotalFee = Number(feeTotal);
              var fiatTotalFee = Number(feeTotal) * Number(priceFiat);
            } else {
              var rex = feePercent.split(/\b(\d+\.\d+)\b/);
              // fees = rex[1] / 100;
              if (rex[1] == undefined) {
                fees = rex[0] / 100;
              } else {
                fees = rex[1] / 100;
              }
              var btcTotalFee = fees * totalBtc;
              var fiatTotalFee = fees * totalFiat;
            }
            totalBtc = Number(totalBtc) + btcTotalFee;
            totalFiat = Number(totalFiat) + fiatTotalFee;
            var usdRate = 1 / rate;
            var totalUsdFiat = totalFiat * usdRate;
            btcTotalFee = btcTotalFee.toFixed(8);
            totalBtc = totalBtc.toFixed(8);
            totalFiat = totalFiat.toFixed(2);
            fiatTotalFee = fiatTotalFee.toFixed(2);
            if (order == 'buy') {
              // console.log(totalBtc);
              $.ajax({
                url: '/checkExchangeUnits',
                type: 'get',
                dataType: 'jsonp',
                data: {
                  name: 'Bitcoin',
                  exchange: exchange
                },
                success: function (data) {
                  if (totalBtc > data) {
                    $('#lessBtcAltBuyModal').modal('show');
                    $("#fee").val(btcTotalFee)
                    $("#total-btc").val(totalBtc);
                    $("#total-fiat").val(totalFiat);
                  } else {
                    $("#fee").val(btcTotalFee)
                    $("#total-btc").val(totalBtc);
                    $("#total-fiat").val(totalFiat);
                  }
                }
              });
            } else {
              $.ajax({
                url: '/checkExchangeUnits',
                type: 'get',
                data: {
                  name: name,
                  exchange: exchange
                },
                dataType: 'jsonp',
                success: function (data) {
                  // console.log(data);
                  if (totalBtc > data) {
                    $('#lessBtcModal').modal('show');
                    $("#fee").val(btcTotalFee)
                    $("#total-btc").val(totalBtc);
                    $("#total-fiat").val(totalFiat);
                  } else {
                    $("#fee").val(btcTotalFee)
                    $("#total-btc").val(totalBtc);
                    $("#total-fiat").val(totalFiat);
                  }
                }
              });
            }
          }
        }
      });
      $('.price_fiat_numbers').each(function () {
        var item = $(this).text();
        if (Number(item) < 0.01) {
          var value = parseFloat(item * rate).toFixed(8);
          var num = Number(value).toLocaleString('en');
          $(this).text(show + num);
        } else {
          var value = parseFloat(item * rate).toFixed(2);
          var num = Number(value).toLocaleString('en');
          $(this).text(show + num);
        }
      })
      $('.market_cap_numbers').each(function () {
        var item = parseFloat($(this).text());
        // console.log(item);
        var num = Number(item);
        // console.log(num);
        if (isNaN(num)) {
          // console.log("lol");
          num = show + 0;
          $(this).text(num);
        } else {
          num  = item * rate
          var num2 = Number(num).toLocaleString('en');
          data = show + num2;
          $(this).text(data);
        }
      })
      $(function () {
        $(".portfolio-price-usd").each(function () {
          var newPortfolioUsd = parseFloat($(this).text());
          newPortfolioUsd = (newPortfolioUsd * rate).toFixed(2);
          newPortfolioUsd = (Number(newPortfolioUsd)).toLocaleString('en');
          $(this).text(show + newPortfolioUsd);
          // console.log(show + newPortfolioUsd);
        })
      })
      $(function () {
        $(".trade-price-usd").each(function () {
          var newPortfolioUsd = parseFloat($(this).text());
          newPortfolioUsd = (newPortfolioUsd * rate).toFixed(2);
          newPortfolioValue = (Number(newPortfolioUsd)).toLocaleString('en');
          $(this).text(show + newPortfolioValue);
        })
      })
      var cryptoName = $('#name').val();
      if (cryptoName == 'Bitcoin') {
        $("#fee-label").text("Fee (" + symbol + ")");
      } else {
        $("#fee-label").text("Fee (BTC)");
        $(".new-coin-container").on('click', '#price-btc', function() {
          var exchange = $("#portfolio-exchange").val();
          var units = $("#units").val();
          if (exchange == null && units == '') {
            $('#exchangeModal').modal('show');
          }
          if (exchange != null && units == '') {
            // console.log("lol");
            $('#exchangePriceModal').modal('show');
          }
        })
      }
      $(".new-coin-container").on('input', '#price-btc', function() {
        var price = $(this).val();
        // var priceFiat = $("#add-price-fiat").val();
        var units = $("#units").val();
        var priceBtc = price * units;
        var feeBtc = fees * priceBtc;
        var totalBtc = priceBtc + feeBtc;
        var exchange = $("#portfolio-exchange").val();
        var order = $("#order:checked").val();
        feeBtc = feeBtc.toFixed(8);
        totalBtc = totalBtc.toFixed(8);
        if (order == 'buy') {
          $.ajax({
            url: '/checkExchangeUnits',
            type: 'get',
            dataType: 'jsonp',
            data: {
              name: 'Bitcoin',
              exchange: exchange
            },
            success: function (data) {
              $.ajax({
                url: '/checkBtcPrice',
                type: 'get',
                dataType: 'jsonp',
                success: function (btcPrice) {
                  var newPrice = (btcPrice * price).toFixed(2);
                  var newTotal = (btcPrice * Number(totalBtc)).toFixed(2);
                  $("#add-price-fiat").val(newPrice);
                  $("#total-fiat").val(newTotal);
                  if (totalBtc > data) {
                    $('#lessBtcAltBuyModal').modal('show');
                    $('#fee').val(feeBtc);
                    $('#total-btc').val(totalBtc);
                  } else {
                    $('#fee').val(feeBtc);
                    $('#total-btc').val(totalBtc);
                  }
                }
              })
            }
          });
        } else {
          $.ajax({
            url: '/checkExchangeUnits',
            type: 'get',
            data: {
              name: name,
              exchange: exchange
            },
            dataType: 'jsonp',
            success: function (data) {
              // console.log(data);
              if (units > data) {
                $('#lessBtcModal').modal('show');
                $('#fee').val(feeBtc);
                $('#total-btc').val(totalBtc);
              } else {
                $('#fee').val(feeBtc);
                $('#total-btc').val(totalBtc);
              }
            }
          });
        }
      });
      $(".new-coin-container").on('click', '#total-fiat', function() {
        var exchange = $("#portfolio-exchange").val();
        var order = $("#order:checked").val();
        var feePercent = $("#add-fee-percent").val();
        if (exchange == null && order == undefined) {
          $('#exchangeModal').modal('show');
        } else if (exchange != null && order == undefined) {
          $('#orderModal').modal('show');
        }
        if ((exchange != null && order != undefined) && feePercent == '') {
          $('#addFeeModal').modal('show');
        }
      })
      $(".new-coin-container").on('input', '#total-fiat', function() {
        var name = $(this.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.lastElementChild).val();
        var total = $(this).val();
        var priceFiat = parseFloat($(this.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.lastElementChild).val());
        var priceBtc = parseFloat($(this.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.lastElementChild).val());
        var units = total / priceFiat;
        var totalFiatPrice = units * priceFiat;
        var order = $("#order:checked").val();
        var exchange = $("#portfolio-exchange").val();
        var feePercent = $("#add-fee-percent").val();
        var feeTotal = $("#fee").val();
        if (feePercent == "" && feeTotal == "") {
          $('#addFeeModal').modal('show');
        } else {
          if (name == 'Bitcoin') {
            if (feePercent == "-")  {
              var fiatTotalFee = Number(feeTotal);
            } else {
              var rex = feePercent.split(/\b(\d+\.\d+)\b/);
              if (rex[1] == undefined) {
                fees = rex[0] / 100;
              } else {
                fees = rex[1] / 100;
              }
              var fiatTotalFee = fees * total;
            }
            var actualPrice = total - fiatTotalFee;
            var usdRate = 1 / rate;
            var totalUsdFiat = total * usdRate;
            units = actualPrice / priceFiat;
            units = units.toFixed(8);
            var totalBtc = units;
            totalBtc = (parseFloat(total)).toFixed(8);
            fiatTotalFee = fiatTotalFee.toFixed(2);
            if (order == 'buy') {
              $.ajax({
                url: '/checkExchangeUnits',
                type: 'get',
                dataType: 'jsonp',
                data: {
                  name: 'Fiat (USD)',
                  exchange: exchange
                },
                success: function (data) {
                  if (totalUsdFiat > data) {
                    $('#lessFiatModal').modal('show');
                    $("#fee").val(fiatTotalFee)
                    $("#total-btc").val((parseFloat(units)).toFixed(8));
                    $("#units").val((parseFloat(units)).toFixed(8));
                  } else {
                    $("#fee").val(fiatTotalFee)
                    $("#total-btc").val((parseFloat(units)).toFixed(8));
                    $("#units").val((parseFloat(units)).toFixed(8));
                  }
                }
              });
            } else {
              $.ajax({
                url: '/checkExchangeUnits',
                type: 'get',
                data: {
                  name: name,
                  exchange: exchange
                },
                dataType: 'jsonp',
                success: function (data) {
                  // console.log(data);
                  if (totalBtc > data) {
                    $('#lessBtcModal').modal('show');
                    $("#fee").val(fiatTotalFee)
                    $("#total-btc").val(units.toFixed(8));
                    $("#units").val(units.toFixed(8));
                  } else {
                    $("#fee").val(fiatTotalFee)
                    $("#total-btc").val(units.toFixed(8));
                    $("#units").val(units.toFixed(8));
                  }
                }
              });
            }
          } else {
            if (feePercent == "-")  {
              var btcTotalFee = Number(feeTotal);
              var fiatTotalFee = Number(feeTotal) * Number(priceFiat);
              var totalFiat = Number(total) + fiatTotalFee;
              var usdRate = 1 / rate;
              var totalUsdFiat = totalFiat * usdRate;
              var actualPrice = total - fiatTotalFee;
              units = actualPrice / priceFiat;
              units = units.toFixed(8);
              fiatTotalFee = fiatTotalFee.toFixed(2);
              btcTotalFee = btcTotalFee.toFixed(8);
            } else {
              var rex = feePercent.split(/\b(\d+\.\d+)\b/);
              if (rex[1] == undefined) {
                fees = rex[0] / 100;
              } else {
                fees = rex[1] / 100;
              }
              var fiatTotalFee = fees * total;
              // console.log(fees + " " + priceFiat);
              // console.log(total);
              var x = ((total - (fees * priceFiat)) / (fees + priceFiat));
              console.log(x);
              // console.log(fiatTotalFee);
              // console.log(btcTotalFee);
              // var totalFiat = Number(total) + fiatTotalFee;
              // var usdRate = 1 / rate;
              // var totalUsdFiat = totalFiat * usdRate;
              var actualPrice = total - fiatTotalFee;
              // console.log(actualPrice);
              units = actualPrice / priceFiat;
              var totalBtc = units * priceBtc;
              var btcTotalFee = fees * totalBtc;
              // console.log(total + " " + actualPrice + " " + units + " " + totalBtc);
              // var btcTotalFee = units * fees;
              units = units.toFixed(8);
              totalBtc = totalBtc.toFixed(8);
              // fiatTotalFee = fiatTotalFee.toFixed(2);
              btcTotalFee = btcTotalFee.toFixed(8);
            }
            if (order == 'buy') {
              $.ajax({
                url: '/checkExchangeUnits',
                type: 'get',
                dataType: 'jsonp',
                data: {
                  name: 'Bitcoin',
                  exchange: exchange
                },
                success: function (data) {
                  if (totalBtc > data) {
                    $('#lessBtcAltBuyModal').modal('show');
                    $("#fee").val(btcTotalFee)
                    $("#total-btc").val(totalBtc);
                    $("#units").val(units);
                  } else {
                    $("#fee").val(btcTotalFee)
                    $("#total-btc").val(totalBtc);
                    $("#units").val(units);
                  }
                }
              });
            } else {
              $.ajax({
                url: '/checkExchangeUnits',
                type: 'get',
                data: {
                  name: name,
                  exchange: exchange
                },
                dataType: 'jsonp',
                success: function (data) {
                  // console.log(data);
                  if (units > data) {
                    $('#lessBtcModal').modal('show');
                    $("#fee").val(btcTotalFee)
                    $("#total-btc").val(totalBtc);
                    $("#units").val(units);
                  } else {
                    $("#fee").val(btcTotalFee)
                    $("#total-btc").val(totalBtc);
                    $("#units").val(units);
                  }
                }
              });
            }
          }
        }
      });
      $(".new-coin-container").on('click', '#total-btc', function() {
        var exchange = $("#portfolio-exchange").val();
        var order = $("#order:checked").val();
        var feePercent = $("#add-fee-percent").val();
        if (exchange == null && order == undefined) {
          $('#exchangeModal').modal('show');
        } else if (exchange != null && order == undefined) {
          $('#orderModal').modal('show');
        }
        if ((exchange != null && order != undefined) && feePercent == '') {
          $('#addFeeModal').modal('show');
        }
      })
      $(".new-coin-container").on('input', '#total-btc', function() {
        var total = $(this).val();
        var name = $(this.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.lastElementChild).val();
        var exchange = $("#portfolio-exchange").val();
        var order = $("#order:checked").val();
        var priceBtc = parseFloat($('#price-btc').val());
        var priceFiat = parseFloat($('#add-price-fiat').val());
        var feePercent = $("#add-fee-percent").val();
        var feeTotal = $("#fee").val();
        if (feePercent == "" && feeTotal == "") {
          $('#addFeeModal').modal('show');
        } else {
          if (name == 'Bitcoin') {
            var units = total;
            var totalFiatPrice = units * priceFiat;
            if (feePercent == "-")  {
              var feesFiat = feeTotal;
              var totalWithFees = totalFiatPrice + Number(feesFiat);
            } else {
              var rex = feePercent.split(/\b(\d+\.\d+)\b/);
              if (rex[1] == undefined) {
                fees = rex[0] / 100;
              } else {
                fees = rex[1] / 100;
              }
              var fiatTotalFee = fees * totalFiatPrice;
              var totalWithFees = totalFiatPrice + Number(fiatTotalFee);
              // console.log(fees);
              // console.log(fiatTotalFee);
              // console.log(totalWithFees);
              $("#fee").val((parseFloat(fiatTotalFee)).toFixed(2));
            }
            var usdRate = 1 / rate;
            var totalUsdFiat = totalWithFees * usdRate;
            var totalBtc = units;
            if (order == 'buy') {
              $.ajax({
                url: '/checkExchangeUnits',
                type: 'get',
                dataType: 'jsonp',
                data: {
                  name: 'Fiat (USD)',
                  exchange: exchange
                },
                success: function (data) {
                  if (totalUsdFiat > data) {
                    $('#lessFiatModal').modal('show');
                    $("#total-fiat").val(totalWithFees.toFixed(2));
                    $("#units").val((parseFloat(units)).toFixed(8));
                  } else {
                    $("#total-fiat").val(totalWithFees.toFixed(2));
                    $("#units").val((parseFloat(units)).toFixed(8));
                  }
                }
              });
            } else {
              $.ajax({
                url: '/checkExchangeUnits',
                type: 'get',
                data: {
                  name: name,
                  exchange: exchange
                },
                dataType: 'jsonp',
                success: function (data) {
                  if (totalBtc > data) {
                    $('#lessBtcModal').modal('show');
                    $("#total-fiat").val(totalWithFees.toFixed(2));
                    $("#units").val((parseFloat(units)).toFixed(8));
                  } else {
                    $("#total-fiat").val(totalWithFees.toFixed(2));
                    $("#units").val((parseFloat(units)).toFixed(8));
                  }
                }
              });
            }
          } else {
            if (feePercent == "-")  {
              var btcTotalFee = Number(feeTotal);
              var fiatTotalFee = Number(feeTotal) * Number(priceFiat);
              var totalFiat = Number(total) + fiatTotalFee;
              var usdRate = 1 / rate;
              var totalUsdFiat = totalFiat * usdRate;
              var actualPrice = total - fiatTotalFee;
              units = actualPrice / priceFiat;
              units = units.toFixed(8);
              fiatTotalFee = fiatTotalFee.toFixed(2);
              btcTotalFee = btcTotalFee.toFixed(8);
            } else {
              var rex = feePercent.split(/\b(\d+\.\d+)\b/);
              fees = rex[1] / 100;
              var btcTotalFee = fees * total;
              var fiatTotalFee = btcTotalFee * priceBtc;
              // var totalFiat = Number(total) + fiatTotalFee;
              // var usdRate = 1 / rate;
              // var totalUsdFiat = totalFiat * usdRate;
              var actualPrice = total - btcTotalFee;
              units = actualPrice / priceBtc;
              var totalBtc = units * priceBtc;
              // var btcTotalFee = units * fees;
              units = units.toFixed(8);
              totalBtc = totalBtc.toFixed(8);
              // fiatTotalFee = fiatTotalFee.toFixed(2);
              btcTotalFee = btcTotalFee.toFixed(8);
            }
            if (order == 'buy') {
              $.ajax({
                url: '/checkExchangeUnits',
                type: 'get',
                dataType: 'jsonp',
                data: {
                  name: 'Bitcoin',
                  exchange: exchange
                },
                success: function (data) {
                  if (totalBtc > data) {
                    $('#lessBtcAltBuyModal').modal('show');
                    $("#fee").val(btcTotalFee)
                    $("#total-btc").val(totalBtc);
                    $("#units").val(units);
                  } else {
                    $("#fee").val(btcTotalFee)
                    $("#total-btc").val(totalBtc);
                    $("#units").val(units);
                  }
                }
              });
            } else {
              $.ajax({
                url: '/checkExchangeUnits',
                type: 'get',
                data: {
                  name: name,
                  exchange: exchange
                },
                dataType: 'jsonp',
                success: function (data) {
                  // console.log(data);
                  if (units > data) {
                    $('#lessBtcModal').modal('show');
                    $("#fee").val(btcTotalFee)
                    $("#total-btc").val(totalBtc);
                    $("#units").val(units);
                  } else {
                    $("#fee").val(btcTotalFee)
                    $("#total-btc").val(totalBtc);
                    $("#units").val(units);
                  }
                }
              });
            }
          }
        }
      });
      $("#fiat-pl-btc").each(function () {
        $.ajax({
            url: '/checkBtcPl',
            type: 'get',
            dataType: 'jsonp',
            success: function (data) {
              // console.log(data + " " + rate);
              data = data * rate;
              data = data.toFixed(2);
              var num = Number(data).toLocaleString('en');
              $("#fiat-pl-btc").text(show + num);
            }
        });
      })
      $("#total-pl-fiat").each(function () {
        var totalFiatPl = $(this);
        $.ajax({
            url: '/checkBtcPl',
            type: 'get',
            dataType: 'jsonp',
            success: function (btcData) {
              btcData = btcData * rate;
              var btcPl = btcData;
              var showBtcPl = btcPl.toFixed(2)
              var num = Number(showBtcPl).toLocaleString('en');
              totalFiatPl.text(show + " " + num);
              var altPlTotal = 0;
              $(".fiat-pl-alt").each(function () {
                var alt = $(this.parentElement.children[0]).text();
                $.ajax({
                  url: '/checkAltFiatPl',
                  type: 'get',
                  data: {
                    coin: alt
                  },
                  dataType: 'jsonp',
                  success: function (altData) {
                    // console.log(altData);
                    altData = altData * rate;
                    altPlTotal += altData;
                    var totalPl = (btcPl + altPlTotal).toFixed(2);
                    var num = Number(totalPl).toLocaleString('en');
                    totalFiatPl.text(show + " " + num);
                  }
                });
              })
            }
        });
      })
      $(".fiat-pl-alt").each(function () {
        var alt = $(this.parentElement.children[0]).text();
        var altPl = $(this);
        // console.log(altPl);
        $.ajax({
          url: '/checkAltFiatPl',
          type: 'get',
          data: {
            coin: alt
          },
          dataType: 'jsonp',
          success: function (data) {
            data = data * rate;
            var pl = data.toFixed(2);
            var num = Number(pl).toLocaleString('en');
            altPl.text(show + num);
          }
        });
      })
      $(function () {
        var total = 0;
        var price = 0;
        $.ajax({
          url: '/checkBtcPrice',
          type: 'get',
          dataType: 'jsonp',
          success: function (btcPrice) {
            $.ajax({
              url: '/checkBtcUnits',
              type: 'get',
              dataType: 'jsonp',
              success: function (btcUnits) {
                $.ajax({
                  url: '/checkAltPrice',
                  type: 'get',
                  dataType: 'jsonp',
                  success: function (altUnits) {
                    total = btcUnits + altUnits;
                    price = btcPrice * total;
                    price = price * rate;
                    price = price.toFixed(2);
                    newPortfolioUsd = (Number(price)).toLocaleString('en');
                    $("#portfolio-fiat").text(show + newPortfolioUsd);
                  }
                });
              }
            });
          }
        });
      })
    }
  })
};

function checkUnits() {
  if (coinName == 'Bitcoin') {
    $.ajax({
      url: '/checkFiatUnits',
      type: 'get',
      dataType: 'jsonp',
      success: function (fiatData) {
        $.ajax({
          url: '/exchangeList',
          type: 'get',
          dataType: 'jsonp',
          success: function (exchangeList) {
            var fiatEx = 0;
            var btcEx = 0;
            for (var i = 0; i < exchangeList.length; i++) {
              if (exchangeList[i].type == 'fiat-btc') {
                fiatEx += 1;
              } else {
                btcEx += 1;
              }
            }
            if (exchangeList.length == 0 || fiatEx == 0) {
              $("#add-coin-to-portfolio").text("Add a " + symbol + "/BTC Exchange to buy Bitcoin");
            } else {
              $.ajax({
                url: '/checkBtcUnits',
                type: 'get',
                dataType: 'jsonp',
                success: function (btcData) {
                  if (fiatData <= 0) {
                    $("#add-coin-to-portfolio").text("Add " + symbol + " to buy Bitcoin");
                  } else {
                    if (btcData <= 0) {
                      $("#add-coin-to-portfolio").text("Add " + coinName + " to Portfolio");
                    } else {
                      $("#add-coin-to-portfolio").text("Buy/Sell " + coinName);
                    }
                  }
                }
              })
            }
          }
        })
      }
    });
  } else {
    $.ajax({
      url: '/checkBtcUnits',
      type: 'get',
      dataType: 'jsonp',
      success: function (btcData) {
        $.ajax({
          url: '/checkAltUnits',
          type: 'get',
          data: {
            coin: coinName
          },
          dataType: 'jsonp',
          success: function (altData) {
            $.ajax({
              url: '/exchangeList',
              type: 'get',
              dataType: 'jsonp',
              success: function (exchangeList) {
                var fiatEx = 0;
                var btcEx = 0;
                for (var i = 0; i < exchangeList.length; i++) {
                  if (exchangeList[i].type == 'fiat-btc') {
                    fiatEx += 1;
                  } else {
                    btcEx += 1;
                  }
                }
                if (exchangeList.length == 0 || btcEx == 0) {
                  $("#add-coin-to-portfolio").text("Add a BTC/ALT Exchange to buy Altcoins");
                } else {
                  if (btcData <= 0) {
                    $("#add-coin-to-portfolio").text("Add Bitcoin to buy " + coinName);
                  } else {
                    $.ajax({
                      url: '/checkExchangeUnits',
                      type: 'get',
                      data: {
                        name: 'Bitcoin',
                        exchange: 'Bittrex'
                      },
                      dataType: 'jsonp',
                      success: function (data) {
                        if (data > 0) {
                          if (altData <= 0) {
                            console.log("data");
                            $("#add-coin-to-portfolio").text("Add " + coinName + " to Portfolio");
                          } else {
                            $("#add-coin-to-portfolio").text("Buy/Sell " + coinName);
                          }
                        } else {
                          $("#add-coin-to-portfolio").text("Transfer some BTC to an Altcoin exhchage");
                        }
                      }
                    });
                  }
                }
              }
            })
          }
        });
      }
    });
  }
}
