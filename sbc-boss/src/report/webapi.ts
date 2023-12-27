// import {} 
import { Fetch } from 'qmkit';
export const pickGoods = (prame) =>{
    // JSON.parse
    return Fetch(`pickGoods/pileAndTradeStatistics?beginTime=${JSON.stringify(prame.beginTime)}?endTime=${prame.endTime}`,{
        //    method:'get',
        //    body: JSON.stringify(prame)
    })
}  