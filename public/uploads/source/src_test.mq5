//+------------------------------------------------------------------+
//|                                             TopBottomQuant.mq5   |
//|               Ultimate V6: Signal Isolation & Debouncer Engine   |
//+------------------------------------------------------------------+
#property copyright "Antigravity Quant-Analyst"
#property link      ""
#property version   "6.00"
#property indicator_chart_window

//--- Indicator Properties
#property indicator_buffers 2
#property indicator_plots   2

//--- Plot Buy Signal
#property indicator_label1  "Isolated Bottom (Buy)"
#property indicator_type1   DRAW_ARROW
#property indicator_color1  clrLimeGreen
#property indicator_style1  STYLE_SOLID
#property indicator_width1  4

//--- Plot Sell Signal
#property indicator_label2  "Isolated Top (Sell)"
#property indicator_type2   DRAW_ARROW
#property indicator_color2  clrRed
#property indicator_style2  STYLE_SOLID
#property indicator_width2  4

//--- Input Parameters
input string   Grp1 = "--- Matrix Scoring Limits ---";
input int      InpTriggerScore         = 80;    // Minimum Score to Fire (out of 130)
input int      InpPeriod               = 14;    // General Period (RSI, CCI, WR)
input int      InpS_R_Period           = 50;    // Support/Resistance Lookback

input string   Grp2 = "--- Isolation Engine (V6) ---";
input bool     InpUseHook              = true;  // Require Momentum Hook (RSI turning)
input bool     InpUseDebouncer         = true;  // One Signal Per Swing (Remove Clusters)
input double   InpATRExpansion         = 0.8;   // Min Candle Size vs ATR (e.g. 0.8x ATR)

input string   Grp3 = "--- Matrix Weights (Points) ---";
input int      Wt_RSI                  = 20;    // Points if RSI Extreme (<30 / >70)
input int      Wt_CCI                  = 20;    // Points if CCI Extreme (<-100 / >100)
input int      Wt_WR                   = 20;    // Points if W%R Extreme (<-80 / >-20)
input int      Wt_Volatility           = 20;    // Points if Pierce Bollinger Bands
input int      Wt_S_R                  = 20;    // Points if near Major S&R Level
input int      Wt_Candle               = 20;    // Points if Pinbar/Engulfing Pattern
input int      Wt_Volume               = 10;    // Points if Volume is higher than average

input string   Grp4 = "--- Visuals & Alerts ---";
input int      InpArrowGapPoints       = 10;    // Arrow Gap from Candle (in Points)
input bool     InpEnableDashboard      = true;  // Show Info Dashboard
input bool     InpEnableAlerts         = true;  // Enable Pop-up Alerts

//--- Indicator Buffers
double BuyBuffer[];
double SellBuffer[];

//--- Indicator Handles
int handleRSI, handleCCI, handleWPR, handleBands, handleATR;
double rsi[], cci[], wpr[], bandsUpper[], bandsLower[], atr[];

//--- State variables
string lastSignalType = "NONE";
double lastSignalPrice = 0.0;
datetime lastSignalTime = 0;
int currentBuyScore = 0;
int currentSellScore = 0;

//--- Debouncer State (Global to survive ticks)
bool debouncerCanBuy = true;
bool debouncerCanSell = true;

//+------------------------------------------------------------------+
//| Initialization                                                   |
//+------------------------------------------------------------------+
int OnInit()
  {
   SetIndexBuffer(0, BuyBuffer, INDICATOR_DATA);
   SetIndexBuffer(1, SellBuffer, INDICATOR_DATA);

   PlotIndexSetInteger(0, PLOT_ARROW, 233); // Thick Up Arrow
   PlotIndexSetInteger(1, PLOT_ARROW, 234); // Thick Down Arrow

   PlotIndexSetDouble(0, PLOT_EMPTY_VALUE, 0.0);
   PlotIndexSetDouble(1, PLOT_EMPTY_VALUE, 0.0);

   ArraySetAsSeries(BuyBuffer, true);
   ArraySetAsSeries(SellBuffer, true);

   // Initialize Handles
   handleRSI   = iRSI(_Symbol, _Period, InpPeriod, PRICE_CLOSE);
   handleCCI   = iCCI(_Symbol, _Period, InpPeriod, PRICE_TYPICAL);
   handleWPR   = iWPR(_Symbol, _Period, InpPeriod);
   handleBands = iBands(_Symbol, _Period, 20, 0, 2.0, PRICE_CLOSE);
   handleATR   = iATR(_Symbol, _Period, InpPeriod);

   ArraySetAsSeries(rsi, true);
   ArraySetAsSeries(cci, true);
   ArraySetAsSeries(wpr, true);
   ArraySetAsSeries(bandsUpper, true);
   ArraySetAsSeries(bandsLower, true);
   ArraySetAsSeries(atr, true);
   
   return(INIT_SUCCEEDED);
  }

//+------------------------------------------------------------------+
//| Deinitialization                                                 |
//+------------------------------------------------------------------+
void OnDeinit(const int reason)
  {
   if(InpEnableDashboard) Comment("");
  }

//+------------------------------------------------------------------+
//| Support and Resistance check (Highest High / Lowest Low)         |
//+------------------------------------------------------------------+
double GetHighest(const double &high[], int shift, int period)
  {
   double max = 0;
   for(int k=0; k<period; k++)
     {
      if(high[shift+k] > max) max = high[shift+k];
     }
   return max;
  }

double GetLowest(const double &low[], int shift, int period)
  {
   double min = 9999999.0;
   for(int k=0; k<period; k++)
     {
      if(low[shift+k] < min) min = low[shift+k];
     }
   return min;
  }

//+------------------------------------------------------------------+
//| Main Iteration                                                   |
//+------------------------------------------------------------------+
int OnCalculate(const int rates_total,
                const int prev_calculated,
                const datetime &time[],
                const double &open[],
                const double &high[],
                const double &low[],
                const double &close[],
                const long &tick_volume[],
                const long &volume[],
                const int &spread[])
  {
   if(rates_total < MathMax(InpS_R_Period, 20)) return(0);

   int limit = rates_total - prev_calculated;
   if(prev_calculated == 0) 
     {
      limit = rates_total - 1;
      // Reset debouncer on full chart recalculation
      debouncerCanBuy = true;
      debouncerCanSell = true;
     }

   ArraySetAsSeries(open, true);
   ArraySetAsSeries(high, true);
   ArraySetAsSeries(low, true);
   ArraySetAsSeries(close, true);
   ArraySetAsSeries(time, true);
   ArraySetAsSeries(tick_volume, true);

   // Copy data
   if(CopyBuffer(handleRSI, 0, 0, rates_total, rsi) <= 0) return 0;
   if(CopyBuffer(handleCCI, 0, 0, rates_total, cci) <= 0) return 0;
   if(CopyBuffer(handleWPR, 0, 0, rates_total, wpr) <= 0) return 0;
   if(CopyBuffer(handleBands, 1, 0, rates_total, bandsUpper) <= 0) return 0;
   if(CopyBuffer(handleBands, 2, 0, rates_total, bandsLower) <= 0) return 0;
   if(CopyBuffer(handleATR, 0, 0, rates_total, atr) <= 0) return 0;

   // We process from oldest to newest to maintain debouncer state historically
   for(int i = limit; i >= 1; i--)
     {
      if(i >= rates_total - InpS_R_Period) continue;

      BuyBuffer[i] = 0.0;
      SellBuffer[i] = 0.0;

      // Reset Debouncers if RSI crosses back to neutral territory
      if(rsi[i] >= 50.0) debouncerCanBuy = true;
      if(rsi[i] <= 50.0) debouncerCanSell = true;

      int buyScore = 0;
      int sellScore = 0;

      // 1. RSI Scoring
      if(rsi[i] < 30.0) buyScore += Wt_RSI;
      if(rsi[i] > 70.0) sellScore += Wt_RSI;

      // 2. CCI Scoring
      if(cci[i] < -100.0) buyScore += Wt_CCI;
      if(cci[i] > 100.0) sellScore += Wt_CCI;

      // 3. Williams %R Scoring
      if(wpr[i] < -80.0) buyScore += Wt_WR;
      if(wpr[i] > -20.0) sellScore += Wt_WR;

      // 4. Volatility (Bollinger Bands)
      if(low[i] <= bandsLower[i]) buyScore += Wt_Volatility;
      if(high[i] >= bandsUpper[i]) sellScore += Wt_Volatility;

      // 5. Support & Resistance Scoring
      double lowest50 = GetLowest(low, i+1, InpS_R_Period);
      double highest50 = GetHighest(high, i+1, InpS_R_Period);
      
      if(MathAbs(low[i] - lowest50) <= (atr[i]*0.5)) buyScore += Wt_S_R;
      if(MathAbs(highest50 - high[i]) <= (atr[i]*0.5)) sellScore += Wt_S_R;

      // 6. Volume Scoring
      double avgVol = 0;
      for(int k=1; k<=20; k++) avgVol += (double)tick_volume[i+k];
      avgVol /= 20.0;
      if((double)tick_volume[i] > avgVol) 
        {
         buyScore += Wt_Volume;
         sellScore += Wt_Volume;
        }

      // 7. Candlestick Patterns
      double body = MathAbs(close[i] - open[i]);
      bool isBullishPinbar = (close[i] > open[i]) && ((open[i] - low[i]) > 2 * body) && ((high[i] - close[i]) < body);
      bool isBearishPinbar = (open[i] > close[i]) && ((high[i] - open[i]) > 2 * body) && ((close[i] - low[i]) < body);
      
      bool isBullishEngulfing = (close[i+1] < open[i+1]) && (close[i] > open[i]) && (close[i] >= open[i+1]) && (open[i] <= close[i+1]);
      bool isBearishEngulfing = (close[i+1] > open[i+1]) && (close[i] < open[i]) && (close[i] <= open[i+1]) && (open[i] >= close[i+1]);

      if(isBullishPinbar || isBullishEngulfing) buyScore += Wt_Candle;
      if(isBearishPinbar || isBearishEngulfing) sellScore += Wt_Candle;

      // ==== V6 ISOLATION FILTERS ==== //

      // Mandatory Bullish/Bearish Match
      bool isGreenCandle = (close[i] > open[i]);
      bool isRedCandle   = (close[i] < open[i]);

      // Momentum Hook Match (RSI turning back)
      bool isHookingUp   = !InpUseHook || (rsi[i] > rsi[i+1]);
      bool isHookingDown = !InpUseHook || (rsi[i] < rsi[i+1]);

      // ATR Volatility Expansion Match
      double totalSize = high[i] - low[i];
      bool atrExpanded = (totalSize >= atr[i] * InpATRExpansion);

      // ==== TRIGGER BUY ==== //
      if(buyScore >= InpTriggerScore && isGreenCandle && isHookingUp && atrExpanded)
        {
         if((!InpUseDebouncer || debouncerCanBuy) && BuyBuffer[i] == 0.0)
           {
            BuyBuffer[i] = low[i] - (_Point * InpArrowGapPoints);
            debouncerCanBuy = false;  // Lock Debouncer
            debouncerCanSell = true;  // Allow opposite

            if(i == 1) // Fresh signal
              {
               lastSignalType = "ISOLATED BUY";
               lastSignalPrice = close[i];
               lastSignalTime = time[i];
               if(prev_calculated != 0 && InpEnableAlerts) Alert("QUANT V6: Perfect Isolated BUY on ", _Symbol, " Score: ", buyScore);
              }
           }
        }

      // ==== TRIGGER SELL ==== //
      if(sellScore >= InpTriggerScore && isRedCandle && isHookingDown && atrExpanded)
        {
         if((!InpUseDebouncer || debouncerCanSell) && SellBuffer[i] == 0.0)
           {
            SellBuffer[i] = high[i] + (_Point * InpArrowGapPoints);
            debouncerCanSell = false; // Lock Debouncer
            debouncerCanBuy = true;   // Allow opposite

            if(i == 1) // Fresh signal
              {
               lastSignalType = "ISOLATED SELL";
               lastSignalPrice = close[i];
               lastSignalTime = time[i];
               if(prev_calculated != 0 && InpEnableAlerts) Alert("QUANT V6: Perfect Isolated SELL on ", _Symbol, " Score: ", sellScore);
              }
           }
        }
        
      // For the dashboard
      if(i == 1)
        {
         currentBuyScore = buyScore;
         currentSellScore = sellScore;
        }
     }

   if(limit <= 1 && InpEnableDashboard) UpdateDashboard(close[0]);

   return(rates_total);
  }

//+------------------------------------------------------------------+
//| On-chart Dashboard Display                                       |
//+------------------------------------------------------------------+
void UpdateDashboard(double close)
  {
   string dash = "\n";
   dash += " ===================================== \n";
   dash += "   [ ISOLATED CONFLUENCE MATRIX V6 ]   \n";
   dash += " ===================================== \n";
   dash += " Hook Filter     : " + (InpUseHook ? "ACTIVE" : "OFF") + " \n";
   dash += " Debouncer (1)   : " + (InpUseDebouncer ? "ACTIVE" : "OFF") + " \n";
   dash += " ATR Expansion   : " + DoubleToString(InpATRExpansion, 1) + "x \n";
   dash += " ------------------------------------- \n";
   dash += " Current Buy     : " + IntegerToString(currentBuyScore) + " Pts\n";
   dash += " Current Sell    : " + IntegerToString(currentSellScore) + " Pts\n";
   dash += " ------------------------------------- \n";
   dash += " Last Signal     : " + lastSignalType + "\n";
   dash += " Signal Price    : " + DoubleToString(lastSignalPrice, _Digits) + "\n";
   dash += " ===================================== \n";

   Comment(dash);
  }
//+------------------------------------------------------------------+
