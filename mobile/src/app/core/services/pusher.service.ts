
import { Injectable } from '@angular/core';
import Pusher from 'pusher-js';
import { environment } from 'src/environments/environment';


@Injectable()
export class PusherService {
  pusher;
  constructor() {
  // Replace this with your pusher key
    this.pusher = new Pusher(environment.pusher.key, {
      cluster: environment.pusher.cluster
    });
  }

  public init(channel) {
    return this.pusher.subscribe(channel);
  }
}
