import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

export interface MessageBrokerMessage<T> {
  data: T;
  sender: string;
}

@Injectable({
  providedIn: 'root',
})
export class MessageBrokerService<T = unknown> implements OnDestroy {
  private messageQueue = new Subject<MessageBrokerMessage<T>>();

  sendMessage(message: MessageBrokerMessage<T>) {
    this.messageQueue.next(message);
  }

  getBroker() {
    return this.messageQueue.asObservable();
  }

  ngOnDestroy(): void {
    this.messageQueue.complete();
  }
}
