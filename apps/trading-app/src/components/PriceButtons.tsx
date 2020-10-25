import React from 'react'
import './PriceButtons.css'
import { PriceUpdateService } from '../services/PriceUpdateService'
import { bind } from '@react-rxjs/core'
import { startWith } from 'rxjs/operators'

const priceUpdateService = new PriceUpdateService()
const [usePriceUpdate] = bind((symbol: string) =>
  priceUpdateService.getPriceUpdateStream(symbol).pipe(startWith(null))
)

const PriceButtons: React.FunctionComponent<{ symbol: string }> = ({
  symbol,
}) => {
  const priceUpdate = usePriceUpdate(symbol)

  return (
    <div className="container">
      <div className="left">
        <span className="label">Sell</span>
        <span className="price">{priceUpdate ? priceUpdate.Bid : '-'}</span>
      </div>
      <div className="right">
        <span className="label">Buy</span>
        <span className="price">{priceUpdate ? priceUpdate.Ask : '-'}</span>
      </div>
    </div>
  )
}

export default PriceButtons
