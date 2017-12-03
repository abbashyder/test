var express         = require('express');
var mongoose        = require('mongoose');
var request         = require("request");
var bodyParser      = require("body-parser");
var cron            = require('node-cron');
var methodOverride  = require('method-override');
var app             = express();

mongoose.connect("mongodb://localhost/portfolio_app_develop", {useMongoClient: true});
mongoose.Promise = global.Promise;
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");

var coinSchema = new mongoose.Schema({
  id: String,
  name: {type: String, text: true},
  symbol: String,
  rank: Number,
  price_usd: Number,
  price_btc: Number,
  volume_usd_24h: Number,
  market_cap_usd: Number,
  available_supply: Number,
  total_supply: Number,
  percent_change_1h: Number,
  percent_change_24h: Number,
  percent_change_7d: Number,
  last_updated: {type: Date}
});

var portfolioFiatRateSchema = new mongoose.Schema({
  base: String,
  rates: {
    AUD: Number,
    CAD: Number,
    CHF: Number,
    CNY: Number,
    EUR: Number,
    GBP: Number,
    HKD: Number,
    INR: Number,
    JPY: Number,
    MXN: Number,
    NZD: Number,
    ZAR: Number
  },
  created_time : {type: Date, default: Date.now}
});

var portfolioFiatSchema = new mongoose.Schema({
  currency: String,
  symbol: String,
  show: String,
  amount: Number,
  date: {type: Date, default: Date.now}
});

var portfolioFiatBuySchema = new mongoose.Schema({
  currency: String,
  symbol: String,
  show: String,
  exchange: String,
  amount: Number,
  date: {type: Date, default: Date.now}
});

var portfolioBtcSchema = new mongoose.Schema({
  name: String,
  symbol: {type: String, default: 'BTC'},
  units: {type: Number, default: 0},
  current_price_btc: {type: Number, default: 1},
  current_price_usd: Number,
  date: {type: Date, default: Date.now}
});

var portfolioAltSchema = new mongoose.Schema({
  name: String,
  symbol: String,
  units: {type: Number, default: 0},
  current_price_btc: Number,
  current_price_usd: Number,
  date: {type: Date, default: Date.now}
});

var portfolioBuySchema = new mongoose.Schema({
  name: String,
  symbol: String,
  exchange: String,
  order: String,
  units: Number,
  trade_price_btc: Number,
  trade_price_usd: Number,
  total_price_btc: Number,
  total_price_usd: Number,
  date: {type: Date, default: Date.now},
  time: {type: String}
});

var portfolioSellSchema = new mongoose.Schema({
  name: String,
  symbol: String,
  exchange: String,
  order: String,
  units: Number,
  trade_price_btc: Number,
  trade_price_usd: Number,
  total_price_btc: Number,
  total_price_usd: Number,
  date: {type: Date, default: Date.now},
  time: {type: String}
});

var exchangeSchema = new mongoose.Schema({
  exchange: String,
  coin: String,
  units: Number,
  current_price_btc: Number,
  current_price_usd: Number,
  date: {type: Date, default: Date.now}
})

var exchangeListSchema = new mongoose.Schema({
  exchange: String,
  type: String,
  tradingFeePercent: Number,
  tradingFeeBtc: Number,
  transferFeePercent: Number,
  transferFeeBtc: Number
})

var settingsSchema = new mongoose.Schema({
  currency: {type: String, default: "US Dollars ($)"},
  symbol: {type: String, default: "USD"},
  show: {type: String, default: "$"}
})

var Coin          = mongoose.model("Coin", coinSchema);
var FiatRate      = mongoose.model("FiatRate", portfolioFiatRateSchema);
var Fiat          = mongoose.model("Fiat", portfolioFiatSchema);
var FiatBuy       = mongoose.model("FiatBuy", portfolioFiatBuySchema);
var Btc           = mongoose.model("Btc", portfolioBtcSchema);
var Alt           = mongoose.model("Alt", portfolioAltSchema);
var Buy           = mongoose.model("Buy", portfolioBuySchema);
var Sell          = mongoose.model("Sell", portfolioSellSchema);
var Exchange      = mongoose.model("Exchange", exchangeSchema);
var ExchangeList  = mongoose.model("ExchangeList", exchangeListSchema);
var Settings      = mongoose.model("Settings", settingsSchema);

app.get("/", function (req, res){
  res.render("index");
})

app.get("/settings", function (req, res) {
  var backURL = req.header('Referer');
  Settings.find({}, function(err, result) {
    // console.log(result);
    if (err) {
      console.log(err);
    } else {
      res.render("settings", {setting: result[0], back: backURL});
    }
  })
});

app.post("/settings", function (req, res) {
  var referer = req.body.referer;
  var regex = /^\w+\:\/+\w+\:\d+\/add/
  var regex1 = /^\w+\:\/+\w+\:\d+\/transfers/
  var result = referer.match(regex);
  var result1 = referer.match(regex1);
  // console.log(result1);
  if (result != null || result1 != null) {
    referer = '/settings'
  }
  var currency = req.body.currency;
  var symbol = '';
  if (currency == 'Indian Rupee - ₹') {
    symbol = 'INR';
    show = '₹';
  } else if (currency == 'Australian Dollar - AUD') {
    symbol = 'AUD';
    show = 'AUD $';
  } else if (currency == 'Canadian Dollar - CAD') {
    symbol = 'CAD';
    show = 'CAD $';
  } else if (currency == 'Chineese Yuan - ¥') {
    symbol = 'CNY';
    show = '¥';
  } else if (currency == 'Euro - €') {
    symbol = 'EUR';
    show = '€';
  } else if (currency == 'Hong Kong Dollar - HKD') {
    symbol = 'HKD';
    show = 'HKD $';
  } else if (currency == 'Japan Yen - ¥') {
    symbol = 'JPY';
    show = '¥';
  } else if (currency == 'Mexico Peso - MXN') {
    symbol = 'MXN';
    show = 'MXN ';
  } else if (currency == 'New Zealand Dollar - NZD') {
    symbol = 'NZD';
    show = 'NZD $';
  } else if (currency == 'South African Rand - R') {
    symbol = 'ZAR';
    show = 'R';
  } else if (currency == 'Swiss Franc - CHF') {
    symbol = 'CHF';
    show = 'CHF ';
  } else if (currency == 'UK Pound - £') {
    symbol = 'GBP';
    show = '£';
  } else if (currency == 'US Dollar - $') {
    symbol = 'USD';
    show = '$';
  }

  Settings.findOneAndUpdate({}, {$set: {currency: currency, symbol: symbol, show: show}}, {upsert: true, new: true, setDefaultsOnInsert: true}, function (err, response) {
    if(err) {
      console.log(err);
    } else {
      console.log("updated settings");
      res.redirect(referer);
    }
  })
});


app.get("/addExchange", function (req, res) {
  var backURL = req.header('Referer');
  // console.log(backURL);
  Settings.find({}, function(err, response) {
    if (err) {
      console.log(err);
    } else {
      res.render("addExchange", {coin: response[0], back: backURL})
    }
  })
})

app.post("/addExchange", function (req, res) {
  var referer = req.body.exchange.referer;
  // console.log(referer);
  var name = req.body.exchange.name;
  var type = req.body.exchange.type;
  var tradingFeePercent = req.body.exchange.tradingfeePercent;
  var transferFeePercent = req.body.exchange.transferfeePercent;
  var tradingFeeBtc = req.body.exchange.tradingfeeBtc;
  var transferFeeBtc = req.body.exchange.transferfeeBtc;
  var regex = /\d\.\d+/
  var tradingResult = tradingFeePercent.match(regex);
  var transferResult = transferFeePercent.match(regex);
  // console.log(result);
  if (tradingResult   == null) {
    tradingFeePercent = 0;
    tradingFeeBtc = Number(tradingFeeBtc);
  } else {
    tradingFeePercent = Number(tradingResult[0]);
    tradingFeeBtc = 0;
  }
  if (transferResult   == null) {
    transferFeePercent = 0;
    transferFeeBtc = Number(transferFeeBtc);
  } else {
    transferFeePercent = Number(transferResult[0]);
    transferFeeBtc = 0;
  }
  var newEx = {
    exchange: name,
    type: type,
    tradingFeePercent: tradingFeePercent,
    tradingFeeBtc: tradingFeeBtc,
    transferFeePercent: transferFeePercent,
    transferFeeBtc: transferFeeBtc
  }
  ExchangeList.create(newEx, function (err, newExch) {
    if (err) {
      console.log(err);
    } else {
      // console.log(referer);
      console.log("Added a new Exchange");
      if (referer == "") {
        res.redirect("/market");
      } else {
        res.redirect(referer);
      }
    }
  })
})

app.get("/market", function (req, res){
  Coin.find({},function(err, allCoins) {
    if(err){
      console.log(err);
    } else {
      res.render("market", {coins: allCoins});
    }
  })
});

app.get("/market/:id", function (req, res) {
  Coin.find({id:req.params.id}, function(err, foundCoin) {
    if(err){
      console.log(err);
    } else {
      Settings.find({}, function (err, response) {
        if (err) {
          console.log(err);
        } else {
          res.render("show", {coin: foundCoin[0], setting: response[0]});
        }
      })
    }
  })
});

app.get("/addFiat", function (req, res){
  var backURL = req.header('Referer');
  ExchangeList.find({}, function (err, result) {
    // console.log(result);
    res.render("addFiat", {back: backURL, exchange: result});
  })
})

app.post("/addFiat", function (req, res) {
  // console.log(req.body.fiat);
  var referer = req.body.referer;
  var fiatCurrency = 'US Dollar';
  var fiatSymbol = 'USD';
  var fiatShow = '$';
  var fiatAmount = req.body.fiat.amount;
  // var feePercent = req.body.fiat.feePercent;
  // var feeAmount = req.body.fiat.tradeFee;
  // var fiatTotal = req.body.fiat.total;
  var newFiat = {};
  getRate(function(data) {
    var fiatRate = data.rate;
    var usdAmount = (fiatAmount / fiatRate).toFixed(2);
    // var usdFeeAmount = (feeAmount / fiatRate).toFixed(2);
    // var usdTotal = (fiatTotal / fiatRate).toFixed(2);
    newFiat = {
      currency: req.body.fiat.currency,
      symbol: req.body.fiat.symbol,
      show: req.body.fiat.show,
      exchange: req.body.fiat.exchange,
      amount: req.body.fiat.amount,
      // feePercent: req.body.fiat.feePercent,
      // feeTotal: req.body.fiat.tradeFee,
      // total: req.body.fiat.total
    }
    Exchange.findOneAndUpdate({exchange: newFiat.exchange, coin: 'Fiat (USD)'}, {$inc: {units: +usdAmount}}, {upsert: true, new: true, setDefaultsOnInsert: true}, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log("Update exchange units");
      }
    })
    Fiat.findOneAndUpdate({}, {$inc: {amount: +usdAmount}, $set: {date: new Date()}}, function (err, newFiat) {
      if (err) {
        console.log(err);
      } else {
        console.log("Updated Fiat Buy Amount");
      }
    });
    FiatBuy.create(newFiat, function (err, newCoin) {
      if (err) {
        console.log(err);
      } else {
        console.log("Added to fiat buy schema");
        res.redirect(referer);
      }
    })
  });
})

app.get("/addCoin", function (req, res){
  var name = req.query.name;
  var price_btc = parseFloat(req.query.price_btc);
  var price_fiat = parseFloat(req.query.price_fiat);
  var symbol = req.query.symbol;
  price_btc = (price_btc).toFixed(8);
  var object = {name, price_btc, price_fiat, symbol}
  ExchangeList.find({}, function (err, result) {
    // console.log(result);
    res.render("addCoin", {object: object, exchange: result});
  })
});

app.post("/newCoin", function (req, res){
  // console.log(req.body.coin);
  var coinName = req.body.coin.name;
  var coinSymbol = req.body.coin.symbol;
  var coinExchange = req.body.coin.exchange;
  var coinDate = req.body.coin.date;
  var coinTime = req.body.coin.time;
  var coinOrder = req.body.coin.order;
  var coinUnits = req.body.coin.units;
  var priceFiat = req.body.coin.trade_price_fiat;
  var priceBtc = req.body.coin.trade_price_btc;
  var totalFiat = req.body.coin.total_price_fiat;
  var totalBtc = req.body.coin.total_price_btc;
  var newObject = {};
  getRate(function(data) {
    // console.log(data);
    var fiatRate = data.rate;
    var usdRate = 1 / fiatRate;
    var usdPriceFiat = (priceFiat * usdRate).toFixed(2);
    var usdTotalFiat = (totalFiat * usdRate).toFixed(2);
    newObject = {
      name: coinName,
      symbol: coinSymbol,
      exchange: coinExchange,
      date: coinDate,
      time: coinTime,
      order: coinOrder,
      units: coinUnits,
      trade_price_btc: priceBtc,
      trade_price_usd: usdPriceFiat,
      total_price_btc: totalBtc,
      total_price_usd: usdTotalFiat
    };
    // console.log(newObject);
    if (newObject.name == 'Bitcoin' && newObject.order == 'buy') {
      Exchange.findOneAndUpdate({exchange: newObject.exchange, coin: newObject.name}, {$inc: {units: +newObject.total_price_btc}, $set: {current_price_btc: newObject.trade_price_btc, current_price_usd: newObject.trade_price_usd}}, {upsert: true, new: true, setDefaultsOnInsert: true}, function (err, result) {
        if (err) {
          console.log(err);
        } else {
          console.log("Update exchange units");
        }
      })
      if (newObject.exchange != 'Bittrex') {
        Exchange.findOneAndUpdate({exchange: newObject.exchange, coin: 'Fiat (USD)'}, {$inc: {units: -newObject.total_price_usd}}, {upsert: true, new: true, setDefaultsOnInsert: true}, function (err, result) {
          if (err) {
            console.log(err);
          } else {
            console.log("Update exchange units");
          }
        })
      }
      Fiat.findOneAndUpdate({}, {$inc: {amount: -newObject.total_price_usd}}, function (err, newFiat) {
        if (err) {
          console.log(err);
        } else {
          console.log("Updated Fiat btc buy Amount");
        }
      })
      Btc.findOneAndUpdate({name: 'Bitcoin'}, {$inc: {units: +req.body.coin.units}}, function (err, newCoins) {
        if (err) {
          console.log(err);
        } else {
          console.log("Bitcoin buy units updated");
        }
      })
      Buy.create(newObject, function (err, newCoin) {
        if (err) {
          console.log(err);
        } else {
          console.log("Added to Buy Schema");
          res.redirect("/portfolio");
        }
      })
    } else if (newObject.name != 'Bitcoin' && newObject.order == 'buy') {
      Exchange.findOneAndUpdate({exchange: newObject.exchange, coin: newObject.name}, {$inc: {units: +newObject.units}, $set: {current_price_btc: newObject.trade_price_btc, current_price_usd: newObject.trade_price_usd}}, {upsert: true, new: true, setDefaultsOnInsert: true}, function (err, result) {
        if (err) {
          console.log(err);
        } else {
          console.log("Update exchange units");
        }
      })
      Exchange.findOneAndUpdate({exchange: newObject.exchange, coin: 'Bitcoin'}, {$inc: {units: -newObject.total_price_btc}, $set: {current_price_btc: newObject.trade_price_btc, current_price_usd: newObject.trade_price_usd}}, {upsert: true, new: true, setDefaultsOnInsert: true}, function (err, result) {
        if (err) {
          console.log(err);
        } else {
          console.log("Update exchange units");
        }
      })
      Btc.findOneAndUpdate({name: 'Bitcoin'}, {$inc: {units: -newObject.total_price_btc}}, function (err, newCoins) {
        if (err) {
          console.log(err);
        } else {
          console.log("Bitcoin alt buy units updated");
        }
      })
      Alt.findOneAndUpdate({name:newObject.name}, {$inc: {units: +newObject.units}, $set: {name: newObject.name, symbol: newObject.symbol}}, {upsert: true, new: true, setDefaultsOnInsert: true}, function(err, newCoin) {
        if (err) {
          console.log(err);
        } else {
          console.log("Added to ALT Schema");
        }
      });
      Buy.create(newObject, function (err, newCoin) {
        if (err) {
          console.log(err);
        } else {
          console.log("Added to Buy Schema");
          res.redirect("/portfolio");
        }
      })
    }
    else if (newObject.name == 'Bitcoin' && newObject.order == 'sell') {
      Exchange.findOneAndUpdate({exchange: newObject.exchange, coin: newObject.name}, {$inc: {units: -newObject.total_price_btc}, $set: {current_price_btc: newObject.trade_price_btc, current_price_usd: newObject.trade_price_usd}}, {upsert: true, new: true, setDefaultsOnInsert: true}, function (err, result) {
        if (err) {
          console.log(err);
        } else {
          console.log("Update exchange units");
        }
      })
      Exchange.findOneAndUpdate({exchange: newObject.exchange, coin: 'Fiat (USD)'}, {$inc: {units: +newObject.total_price_usd}}, {upsert: true, new: true, setDefaultsOnInsert: true}, function (err, result) {
        if (err) {
          console.log(err);
        } else {
          console.log("Update exchange units");
        }
      })
      Btc.findOneAndUpdate({name: 'Bitcoin'}, {$inc: {units: -newObject.units}}, function (err, newCoins) {
        if (err) {
          console.log(err);
        } else {
          console.log("Bitcoin sell units updated");
        }
      })
      Fiat.findOneAndUpdate({}, {$inc: {amount: +newObject.total_price_usd}}, function (err, newInr) {
        if (err) {
          console.log(err);
        } else {
          console.log("Fiat units from btc sell updated");
        }
      })
      Sell.create(newObject, function (err, newCoin) {
        if (err) {
          console.log(err);
        } else {
          console.log("Added to Sell Schema");
          res.redirect("/portfolio");
        }
      })
    } else if (newObject.name != 'Bitcoin' && newObject.order == 'sell') {
      Exchange.findOneAndUpdate({exchange: newObject.exchange, coin: newObject.name}, {$inc: {units: -newObject.units}, $set: {current_price_btc: newObject.trade_price_btc, current_price_usd: newObject.trade_price_usd}}, {upsert: true, new: true, setDefaultsOnInsert: true}, function (err, result) {
        if (err) {
          console.log(err);
        } else {
          console.log("Update exchange units");
        }
      })
      Exchange.findOneAndUpdate({exchange: newObject.exchange, coin: 'Bitcoin'}, {$inc: {units: +newObject.total_price_btc}, $set: {current_price_btc: newObject.trade_price_btc, current_price_usd: newObject.trade_price_usd}}, {upsert: true, new: true, setDefaultsOnInsert: true}, function (err, result) {
        if (err) {
          console.log(err);
        } else {
          console.log("Update exchange units");
        }
      })
      Btc.findOneAndUpdate({name: 'Bitcoin'}, {$inc: {units: +newObject.total_price_btc}}, function (err, newCoins) {
        if (err) {
          console.log(err);
        } else {
          console.log("BTC units from Altcoin sell updated");
        }
      })
      Alt.findOneAndUpdate({name: newObject.name}, {$inc: {units: -newObject.units}}, function (err, newCoins) {
        if (err) {
          console.log(err);
        } else {
          console.log("Altcoin units from alt sell updated");
        }
      })
      Sell.create(newObject, function (err, newCoin) {
        if (err) {
          console.log(err);
        } else {
          console.log("Added to Sell Schema");
          res.redirect("/portfolio");
        }
      })
    }
  })
})

app.get("/portfolio", function (req, res) {
  Fiat.find({}, function (err, foundFiat) {
    FiatBuy.find({}, function (err, foundFiatBuy) {
      Btc.find({}, function (err, foundBtc) {
        Alt.find({}, function (err, foundAlt) {
          Buy.find({}, function (err, buyCoins) {
            Sell.find({}, function (err, sellCoins) {
              res.render("portfolio", {fiat: foundFiat, fiatBuy: foundFiatBuy, btc: foundBtc, alt: foundAlt, buy: buyCoins, sell: sellCoins});
            })
          })
        })
      })
    })
  })
});

app.get("/transfers", function (req, res) {
  ExchangeList.find({}, function (err, result) {
    res.render("transfers", {exchange: result});
  })
})

app.post("/transfers", function (req, res) {
  // console.log(req.body.transfer);
  // res.send("lol")
  var units = Number(req.body.transfer.units);
  var total = Number(req.body.transfer.total);
  Exchange.findOneAndUpdate({coin: 'Bitcoin',exchange: req.body.transfer.fromExchange}, {$inc: {units: -total}}, {upsert: true, new: true, setDefaultsOnInsert: true}, function (err, newCoin) {
    if (err) {
      console.log(err);
    } else {
      console.log("Transferred from BTC");
    }
  })
  Exchange.findOneAndUpdate({coin: 'Bitcoin',exchange: req.body.transfer.toExchange}, {$inc: {units: +units}, $set: {name: 'Bitcoin', exchange: req.body.transfer.toExchange}}, {upsert: true, new: true, setDefaultsOnInsert: true}, function (err, newCoin) {
    if (err) {
      console.log(err);
    } else {
      console.log("Transferred to BTC");
      res.redirect("/market")
    }
  })
})

app.delete("/portfolio/buy/:id", function (req, res) {
  var id = req.params.id;
  Buy.find({_id: id}, function (err, response) {
    if (err) {
      console.log(err);
    } else {
      // console.log(response);
      var name = response[0].name;
      var units = response[0].units;
      var btcAmount = response[0].total_price_btc;
      var amount = response[0].total_price_usd;
      if (response[0].name == 'Bitcoin') {
        Fiat.findOneAndUpdate({}, {$inc: {amount: +amount}}, function (err, newFiat) {
          if (err) {
            console.log(err);
          } else {
            console.log("Updated Btc Buy Delete Fiat Amount");
          }
        })
        Btc.findOneAndUpdate({name: 'Bitcoin'}, {$inc: {units: -units}}, function (err, newCoins) {
          if (err) {
            console.log(err);
          } else {
            console.log("Bitcoin Buy Delete units updated");
          }
        })
        Buy.findByIdAndRemove(id, function (err) {
          if (err) {
            console.log(err);
          } else {
            console.log("BTC buy order deleted");
            res.redirect("/portfolio");
          }
        })
      } else {
        Btc.findOneAndUpdate({name: 'Bitcoin'}, {$inc: {units: +btcAmount}}, function (err, newFiat) {
          if (err) {
            console.log(err);
          } else {
            console.log("Updated Alt Buy Delete Btc Amount");
          }
        })
        Alt.findOneAndUpdate({name: name}, {$inc: {units: -units}}, function (err, newCoins) {
          if (err) {
            console.log(err);
          } else {
            console.log("Altcoin Buy Delete units updated");
          }
        })
        Buy.findByIdAndRemove(id, function (err) {
          if (err) {
            console.log(err);
          } else {
            console.log("Alt buy order deleted");
            res.redirect("/portfolio");
          }
        })
      }
    }
  })
})


app.delete("/portfolio/sell/:id", function (req, res) {
  var id = req.params.id;
  Sell.find({_id: id}, function (err, response) {
    if (err) {
      console.log(err);
    } else {
      // console.log(response);
      var name = response[0].name;
      var units = response[0].units;
      var btcAmount = response[0].total_price_btc;
      var amount = response[0].total_price_usd;
      if (response[0].name == 'Bitcoin') {
        Fiat.findOneAndUpdate({}, {$inc: {amount: -amount}}, function (err, newFiat) {
          if (err) {
            console.log(err);
          } else {
            console.log("Updated Btc Sell Delete Fiat Amount");
          }
        })
        Btc.findOneAndUpdate({name: 'Bitcoin'}, {$inc: {units: +units}}, function (err, newCoins) {
          if (err) {
            console.log(err);
          } else {
            console.log("Bitcoin Sell Delete units updated");
          }
        })
        Sell.findByIdAndRemove(id, function (err) {
          if (err) {
            console.log(err);
          } else {
            console.log("BTC sell order deleted");
            res.redirect("/portfolio");
          }
        })
      } else {
        Btc.findOneAndUpdate({name: 'Bitcoin'}, {$inc: {units: -btcAmount}}, function (err, newFiat) {
          if (err) {
            console.log(err);
          } else {
            console.log("Updated Alt Sell Delete Btc Amount");
          }
        })
        Alt.findOneAndUpdate({name: name}, {$inc: {units: +units}}, function (err, newCoins) {
          if (err) {
            console.log(err);
          } else {
            console.log("Altcoin Sell Delete units updated");
          }
        })
        Sell.findByIdAndRemove(id, function (err) {
          if (err) {
            console.log(err);
          } else {
            console.log("Alt Sell order deleted");
            res.redirect("/portfolio");
          }
        })
      }
    }
  })
})

app.delete("/fiat/:id", function (req, res) {
  // console.log();
  var id = req.params.id;
  FiatBuy.find({_id: id}, function (err, response) {
    var symbol = response[0].symbol;
    var amountCurrency = response[0].amount;
    if (symbol == 'INR') {
      FiatRate.find({}, function (err, result) {
        var rate = result[0].rates.INR;
        var usdAmount = amountCurrency / rate;
        updateFiatDelete(usdAmount);
      })
    } else if (symbol == 'CNY') {
      FiatRate.find({}, function (err, result) {
        var rate = result[0].rates.CNY;
        var usdAmount = amountCurrency / rate;
        updateFiatDelete(usdAmount);
      })
    } else if (symbol == 'EUR') {
      FiatRate.find({}, function (err, result) {
        var rate = result[0].rates.EUR;
        var usdAmount = amountCurrency / rate;
        updateFiatDelete(usdAmount);
      })
    } else if (symbol == 'ZAR') {
      FiatRate.find({}, function (err, result) {
        var rate = result[0].rates.ZAR;
        var usdAmount = amountCurrency / rate;
        updateFiatDelete(usdAmount);
      })
    } else if (symbol == 'NZD') {
      FiatRate.find({}, function (err, result) {
        var rate = result[0].rates.NZD;
        var usdAmount = amountCurrency / rate;
        updateFiatDelete(usdAmount);
      })
    } else if (symbol == 'MXN') {
      FiatRate.find({}, function (err, result) {
        var rate = result[0].rates.MXN;
        var usdAmount = amountCurrency / rate;
        updateFiatDelete(usdAmount);
      })
    } else if (symbol == 'JPY') {
      FiatRate.find({}, function (err, result) {
        var rate = result[0].rates.JPY;
        var usdAmount = amountCurrency / rate;
        updateFiatDelete(usdAmount);
      })
    } else if (symbol == 'HKD') {
      FiatRate.find({}, function (err, result) {
        var rate = result[0].rates.HKD;
        var usdAmount = amountCurrency / rate;
        updateFiatDelete(usdAmount);
      })
    } else if (symbol == 'GBP') {
      FiatRate.find({}, function (err, result) {
        var rate = result[0].rates.GBP;
        var usdAmount = amountCurrency / rate;
        updateFiatDelete(usdAmount);
      })
    } else if (symbol == 'CHF') {
      FiatRate.find({}, function (err, result) {
        var rate = result[0].rates.CHF;
        var usdAmount = amountCurrency / rate;
        updateFiatDelete(usdAmount);
      })
    } else if (symbol == 'CAD') {
      FiatRate.find({}, function (err, result) {
        var rate = result[0].rates.CAD;
        var usdAmount = amountCurrency / rate;
        updateFiatDelete(usdAmount);
      })
    } else if (symbol == 'USD') {
      var rate = 1;
      var usdAmount = amountCurrency / rate;
      updateFiatDelete(usdAmount);
    }
    FiatBuy.findByIdAndRemove({_id: id}, function (err, newCoin) {
      if (err) {
        console.log(err);
      } else {
        console.log("Deleted fiat from fuat buy schema");
        res.redirect("/portfolio");
      }
    })
  })
})

app.post("/deleteAll", function (req, res){
  Fiat.findOneAndUpdate({}, {$set: {amount: 0}}, function (err, newFiat) {
    if (err) {
      console.log(err);
    } else {
      console.log("Reset Fiat Units");
      Btc.findOneAndUpdate({name: 'Bitcoin'}, {$set: {units: 0}}, function (err, newFiat) {
        if (err) {
          console.log(err);
        } else {
          console.log("Reset BTC Units");
          Alt.update({}, {$set: {units: 0}}, {multi: true}, function (err, newFiat) {
            if (err) {
              console.log(err);
            } else {
              console.log("Reset ALT Units");
              FiatBuy.remove({}, function (err, newFiat) {
                if (err) {
                  console.log(err);
                } else {
                  console.log("Deleted all Fiat Buy Orders");
                  Buy.remove({}, function (err, newFiat) {
                    if (err) {
                      console.log(err);
                    } else {
                      console.log("Deleted all Buy Orders");
                      Sell.remove({}, function (err, newFiat) {
                        if (err) {
                          console.log(err);
                        } else {
                          console.log("Deleted all Sell Orders");
                          Exchange.remove({}, function (err, newFiat) {
                            if (err) {
                              console.log(err);
                            } else {
                              console.log("Deleted all Exchange Units");
                              res.redirect("/portfolio")
                            }
                          })
                        }
                      })
                    }
                  })
                }
              })
            }
          })
        }
      })
    }
  })
})

// ajax call
app.get("/getSettings", function (req, res) {
  Settings.find({}, function(err, response) {
    if (err) {
      console.log(err);
    } else {
      res.jsonp(response[0]);
    }
  })
});

// ajax call
app.get("/getExchangeRate", function (req, res) {
  getRate(function(data) {
    res.jsonp(data);
  })
});

app.get("/exchangeList", function (req, res) {
  ExchangeList.find({}, function (err, response) {
    // console.log(response);
    res.jsonp(response)
  })
})

app.get("/findExchange", function (req, res) {
  var name = req.query.name;
  ExchangeList.find({exchange: name}, function (err, response) {
    // console.log(response);
    res.jsonp(response)
  })
})

app.get("/checkFiatUnits", function (req, res) {
  Fiat.find({}, function (err, response) {
    res.jsonp(response[0].amount);
  })
})

app.get("/checkBtcUnits", function (req, res) {
  Btc.find({name:'Bitcoin'}, function (err, response) {
    res.jsonp(response[0].units);
  })
})

app.get("/checkAltUnits", function (req, res) {
  Alt.find({name: req.query.coin}, function (err, response) {
    res.jsonp(response[0].units);
  })
})

app.get("/checkExchangeUnits", function (req, res) {
  Exchange.find({coin: req.query.name,exchange: req.query.exchange}, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      if (result[0] == undefined) {
        res.jsonp('0');
        // console.log("lol");
      } else {
        res.jsonp(result[0].units);
      }
    }
  })
})

// app.get("/checkExchangeBtcUnits", function (req, res) {
//   Exchange.find({coin: 'Bitcoin'}, function (err, result) {
//     if (err) {
//       console.log(err);
//     } else {
//       var totalUnits = 0;
//       for (i = 0; i < result.length; i++) {
//         totalUnits += result[i].units;
//       }
//       if (totalUnits > 0) {
//         res.jsonp(totalUnits);
//       } else {
//         res.jsonp(0);
//       }
//     }
//   })
// })

app.get("/checkBtcPrice", function (req, res) {
  Coin.find({name: 'Bitcoin'}, function (err, response) {
    res.jsonp(response[0].price_usd);
  })
})

app.get("/checkAltPrice", function (req, res) {
  var sum = 0;
  Alt.find({}, function (err, response) {
    for (i = 0; i < response.length; i++) {
      var units = response[i].units;
      var price = response[i].current_price_btc;
      var total = units * price;
      sum += total
    }
    res.jsonp(sum);
  })
})

app.get("/checkBuyOrders", function (req, res) {
  Buy.find({_id: req.query.coin}, function (err, response) {
    res.jsonp(response);
  })
})

app.get("/checkBtcBuyOrders", function (req, res) {
  Buy.find({name: req.query.coin}, function (err, response) {
    res.jsonp(response);
  })
})

app.get("/checkBtcSellOrders", function (req, res) {
  Sell.find({name: req.query.coin}, function (err, response) {
    res.jsonp(response);
  })
})

app.get("/checkSellOrders", function (req, res) {
  Sell.find({_id: req.query.coin}, function (err, response) {
    res.jsonp(response);
  })
})

app.get("/checkBtcPl", function (req, res) {
  var units = 0;
  Buy.find({name: 'Bitcoin'}, function (err, buyResults) {
    var buyTotal = 0;
    var buyUnits = 0;
    var samples = buyResults.length;
    for (i = 0; i < buyResults.length; i++) {
      buyTotal += buyResults[i].trade_price_usd;
      buyUnits += buyResults[i].units;
    }
    var buyAvgPrice = buyTotal/samples;
    var buyAvg = buyAvgPrice * buyUnits;
    Sell.find({name: 'Bitcoin'}, function (err, sellResults) {
      var sellTotal = 0;
      var sellUnits = 0;
      var samples = sellResults.length;
      for (i = 0; i < sellResults.length; i++) {
        sellTotal += sellResults[i].trade_price_usd;
        sellUnits += sellResults[i].units;
      }
      var sellAvgPrice = sellTotal/samples;
      var sellAvg = sellAvgPrice * sellUnits
      Btc.find({name: 'Bitcoin'}, function (err, response) {
        var holdUnits = response[0].units;
        var price = response[0].current_price_usd;
        if (isNaN(buyAvg)) {
          buyAvg = 0;
        }
        if (isNaN(sellAvg)) {
          sellAvg = 0;
        }
        Buy.find({}, function (err, result) {
          var altPrice = 0;
          for (var i = 0; i < result.length; i++) {
            if (result[i].name != 'Bitcoin') {
              altPrice += result[i].total_price_usd;
            }
          }
          var holdPrice = holdUnits * price;
          var pl = (holdPrice + sellAvg + altPrice) - buyAvg;
          pl = parseFloat(pl);
          res.jsonp(pl);
        })
      })
    })
  })
})

app.get("/checkAltBtcPl", function (req, res) {
  var units = 0;
  var coin = req.query.coin;
  Buy.find({name: coin}, function (err, buyResults) {
    var buyTotal = 0;
    var buyUnits = 0;
    var samples = buyResults.length;
    for (i = 0; i < buyResults.length; i++) {
      buyTotal += buyResults[i].trade_price_btc;
      buyUnits += buyResults[i].units;
    }
    var buyAvgPrice = buyTotal/samples;
    var buyAvg = buyAvgPrice * buyUnits;
    Sell.find({name: coin}, function (err, sellResults) {
      var sellTotal = 0;
      var sellUnits = 0;
      var samples = sellResults.length;
      for (i = 0; i < sellResults.length; i++) {
        sellTotal += sellResults[i].trade_price_btc;
        sellUnits += sellResults[i].units;
      }
      var sellAvgPrice = sellTotal/samples;
      var sellAvg = sellAvgPrice * sellUnits
      Alt.find({name: coin}, function (err, response) {
        holdUnits = response[0].units;
        var price = response[0].current_price_btc;
        if (isNaN(buyAvg)) {
          buyAvg = 0;
        }
        if (isNaN(sellAvg)) {
          sellAvg = 0;
        }
        var holdPrice = holdUnits * price;
        var pl = (holdPrice + sellAvg) - buyAvg;
        pl = parseFloat(pl);
        res.jsonp(pl);
      })
    })
  })
})

app.get("/checkAltFiatPl", function (req, res) {
  var units = 0;
  var coin = req.query.coin;
  Buy.find({name: coin}, function (err, buyResults) {
    var buyTotal = 0;
    var buyUnits = 0;
    var samples = buyResults.length;
    for (i = 0; i < buyResults.length; i++) {
      buyTotal += buyResults[i].trade_price_usd;
      buyUnits += buyResults[i].units;
    }
    var buyAvgPrice = buyTotal/samples;
    var buyAvg = buyAvgPrice * buyUnits;
    Sell.find({name: coin}, function (err, sellResults) {
      var sellTotal = 0;
      var sellUnits = 0;
      var samples = sellResults.length;
      for (i = 0; i < sellResults.length; i++) {
        sellTotal += sellResults[i].trade_price_usd;
        sellUnits += sellResults[i].units;
      }
      var sellAvgPrice = sellTotal/samples;
      var sellAvg = sellAvgPrice * sellUnits
      Alt.find({name: coin}, function (err, response) {
        holdUnits = response[0].units;
        var price = response[0].current_price_usd;
        if (isNaN(buyAvg)) {
          buyAvg = 0;
        }
        if (isNaN(sellAvg)) {
          sellAvg = 0;
        }
        var holdPrice = holdUnits * price;
        var pl = (holdPrice + sellAvg) - buyAvg;
        pl = parseFloat(pl);
        res.jsonp(pl);
      })
    })
  })
})

app.get("/getRates", function (req, res) {
  FiatRate.find({}, function (err, response) {
    res.jsonp(response[0].rates);
  })
})

app.get("/fiatBuys", function (req, res) {
  FiatBuy.find({}, function (err, response) {
    res.jsonp(response);
  })
})

function updateRates (error, response, body) {
  if (!error && response.statusCode == 200) {
    var info = JSON.parse(body);
    FiatRate.findOneAndUpdate({base: 'USD'}, info, {upsert: true, new: true, setDefaultsOnInsert: true}, function() {
      console.log("Updated Fiat Rates");
    });
  }
}

function updateFiat() {
  Fiat.find({}, function (err, fiat) {
    if (fiat.length == 0) {
      Fiat.create({
        currency: 'US Dollar',
        symbol: 'USD',
        show: '$',
        amount: '0'
      });
      console.log("Created $0 USD.");
    } else {
      console.log("There is fiat in portfolio.");
    }
  })
}

function deleteCoins() {
  Coin.remove({}, function (err, results) {
    if (err) {
      console.log(err);
    } else {
      console.log("Deleted All in coin schema");
    }
  })
};

function updateCoins(error, response, body) {
  if (!error && response.statusCode == 200) {
    var info = JSON.parse(body);
    Coin.find().exec(function (err, results) {
      var count = results.length
      if (count != info.length) {
        deleteCoins();
        for (index = 0; index < info.length; ++index) {
          if (info[index].name == 'Bitcoin') {
            Btc.findOneAndUpdate({name: 'Bitcoin'}, {$set: {current_price_usd: info[index].price_usd}}, {upsert: true, new: true, setDefaultsOnInsert: true}, function() {});
            Coin.findOneAndUpdate({id:info[index].id}, info[index], {upsert: true, new: true, setDefaultsOnInsert: true}, function() {});
          } else {
            Alt.findOneAndUpdate({name: info[index].name}, {$set: {name: info[index].name, symbol: info[index].symbol, current_price_btc: info[index].price_btc, current_price_usd: info[index].price_usd}}, {upsert: true, new: true, setDefaultsOnInsert: true}, function() {});
            Coin.findOneAndUpdate({id:info[index].id}, info[index], {upsert: true, new: true, setDefaultsOnInsert: true}, function() {});
          }
        }
      } else {
        console.log("Count matches");
        console.log("Updated Prices");
        for (index = 0; index < info.length; ++index) {
          if (info[index].name == 'Bitcoin') {
            Btc.findOneAndUpdate({name: 'Bitcoin'}, {$set: {current_price_usd: info[index].price_usd}}, {upsert: true, new: true, setDefaultsOnInsert: true}, function() {});
            Coin.findOneAndUpdate({id:info[index].id}, info[index], {upsert: true, new: true, setDefaultsOnInsert: true}, function() {});
          } else {
            Alt.findOneAndUpdate({name: info[index].name}, {$set: {name: info[index].name, symbol: info[index].symbol, current_price_btc: info[index].price_btc, current_price_usd: info[index].price_usd}}, {upsert: true, new: true, setDefaultsOnInsert: true}, function() {});
            Coin.findOneAndUpdate({id:info[index].id}, info[index], {upsert: true, new: true, setDefaultsOnInsert: true}, function() {});
          }
        };
      };
    });
  };
};

function defaultCurrency () {
  Settings.find({}, function(err, response) {
    if (response.length == 0) {
      Settings.create ({
        currency: 'US Dollar - $',
        symbol: 'USD'
      })
    }
  })
};

function getRate(callback) {
  Settings.find({}, function (err, response) {
    var currencyName = response[0].currency;
    var currencySymbol = response[0].symbol;
    var currencyShow = response[0].show;
    if (currencySymbol == 'USD') {
      var rate = '1';
      var data = {currencyName, currencySymbol, currencyShow, rate}
      callback && callback(data);
    } else {
      var rate = '';
      FiatRate.find({}, function (err, results) {
        var defaultCurrency = results[0].rates;
        Object.keys(defaultCurrency).forEach(function () {
          if (currencySymbol == "INR") {
            rate = results[0].rates.INR;
          } else if (currencySymbol == "EUR") {
            rate = results[0].rates.EUR;
          } else if (currencySymbol == "AUD") {
            rate = results[0].rates.AUD;
          } else if (currencySymbol == "ZAR") {
            rate = results[0].rates.ZAR;
          } else if (currencySymbol == "NZD") {
            rate = results[0].rates.NZD;
          } else if (currencySymbol == "MXN") {
            rate = results[0].rates.MXN;
          } else if (currencySymbol == "JPY") {
            rate = results[0].rates.JPY;
          } else if (currencySymbol == "HKD") {
            rate = results[0].rates.HKD;
          } else if (currencySymbol == "GBP") {
            rate = results[0].rates.GBP;
          } else if (currencySymbol == "CNY") {
            rate = results[0].rates.CNY;
          } else if (currencySymbol == "CHF") {
            rate = results[0].rates.CHF;
          } else if (currencySymbol == "CAD") {
            rate = results[0].rates.CAD;
          }
        })
        var data = {currencyName, currencySymbol, currencyShow, rate}
        callback && callback(data);
      })
    }
  })
}

function updateFiatDelete (usdAmount) {
  Fiat.findOneAndUpdate({}, {$inc: {amount: -usdAmount}, $set: {date: new Date()}}, function (err, newFiat) {
    if (err) {
      console.log(err);
    } else {
      console.log("Updated Fiat Delete Amount");
    }
  });
}

var coinAPI = {
  url: 'https://api.coinmarketcap.com/v1/ticker?limit=5000',
  // url : 'https://api.coinmarketcap.com/v1/ticker/?convert=INR',
  // url: 'https://api.coinmarketcap.com/v1/ticker/',
  method: 'GET'
};

var exchangeRateAPI = {
  url: 'http://api.fixer.io/latest?base=USD&symbols=AUD,CAD,CHF,CNY,EUR,GBP,HKD,INR,JPY,MXN,NZD,ZAR',
  method: 'GET'
};

request(coinAPI, updateCoins);
request(exchangeRateAPI, updateRates);

cron.schedule('* * * * *', function(){
  console.log('running a task every minute');
  request(coinAPI, updateCoins);
});

cron.schedule('0 */2 * * *', function(){
  console.log('running a task every 2 hours');
  request(exchangeRateAPI, updateCoins);
});

app.listen(3000, function(){
  console.log("Server has started!!!");
  updateFiat();
  defaultCurrency();
});
