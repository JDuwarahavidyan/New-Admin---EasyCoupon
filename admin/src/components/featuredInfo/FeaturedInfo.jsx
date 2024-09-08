import  './featuredInfo.css'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

export default function FeaturedInfo() {
  return (
    <div className="featured">
      
      <div className="featuredItem">
        <span className="featuredTitle">Total Coupons Used</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">356</span>
          <span className="featuredMoneyRate">
            -11.4 <ArrowDownwardIcon  className="featuredIcon negative"/>
          </span>
        </div>
        <span className="featuredSub">Previous Month</span>
      </div>


      <div className="featuredItem">
        <span className="featuredTitle">Total Coupons Used</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">89</span>
          <span className="featuredMoneyRate">
            -1.4 <ArrowDownwardIcon className="featuredIcon negative"/>
          </span>
        </div>
        <span className="featuredSub">Current Month</span>
      </div>


      <div className="featuredItem">
        <span className="featuredTitle">Cost</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">$2,225</span>
          <span className="featuredMoneyRate">
            +2.4 <ArrowUpwardIcon className="featuredIcon"/>
          </span>
        </div>
        <span className="featuredSub">Compared to last month</span>
      </div>
    </div>
  );
}