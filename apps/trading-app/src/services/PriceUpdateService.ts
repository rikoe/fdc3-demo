import { RxStomp, RxStompRPC } from '@stomp/rx-stomp'
import { map, tap } from 'rxjs/operators'

export interface PriceUpdate {
  Symbol: string
  Bid: number
  Ask: number
  Mid: number
  ValueDate: any
  CreationTimestamp: number
}

export class PriceUpdateService {
  private rxStomp: RxStomp
  private rxStompRPC: RxStompRPC

  constructor() {
    this.rxStomp = new RxStomp()

    this.rxStompRPC = new RxStompRPC(this.rxStomp)

    this.rxStomp.configure({
      brokerURL: `ws://web-demo.adaptivecluster.com:80/ws`,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    })

    this.rxStomp.activate()
  }

  public getPriceUpdateStream(id: string) {
    return this.rxStompRPC
      .stream({
        destination: '/amq/queue/pricing.getPriceUpdates',
        body: JSON.stringify({ payload: { symbol: `${id}` }, Username: 'HHA' }),
      })
      .pipe(
        map(message => {
          return JSON.parse(message.body) as PriceUpdate
        }),
        tap(update =>
          console.debug(
            `Price update received for ${id}: Bid ${update.Bid}, Ask ${update.Ask}`
          )
        )
      )
  }
}
