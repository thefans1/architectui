import {QueryList, Renderer2, ViewChildren, VERSION, Component} from '@angular/core';
import {cloneDeep, random} from 'lodash-es';

import {
  GlobalConfig,
  ToastrService,
  ToastContainerDirective,
  ToastNoAnimation,
} from 'ngx-toastr';

interface Quote {
  title?: string;
  message?: string;
}

const quotes: Quote[] = [
  {
    title: 'Title',
    message: 'Message',
  },
  {
    title: '😃',
    message: 'Supports Emoji',
  },
  {
    message: 'My name is Inigo Montoya. You killed my father. Prepare to die!',
  },
  {
    message: 'Titles are not always needed',
  },
  {
    title: 'Title only 👊',
  },
  {
    title: '',
    message: `Supports Angular 7`,
  },
];
const types = ['success', 'error', 'info', 'warning'];

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
})

export class NotificationsComponent {

  heading = 'Toastr Alerts';
  subheading = 'Notifications represent one of the best ways to give feedback for various users actions.';
  icon = 'pe-7s-glasses icon-gradient bg-love-kiss';

  options: GlobalConfig;
  title = '';
  message = '';
  type = types[0];
  version = VERSION;
  enableBootstrap = false;
  private lastInserted: number[] = [];
  inline = false;
  inlinePositionIndex = 0;
  @ViewChildren(ToastContainerDirective) inlineContainers: QueryList<ToastContainerDirective>;

  constructor(public toastr: ToastrService, private renderer: Renderer2) {
    this.options = this.toastr.toastrConfig;
  }

  public saveEmail(email: string): void {
  }

  public handleRefusalToSetEmail(dismissMethod: string): void {
  }

  getMessage() {
    let m: string | undefined = this.message;
    let t: string | undefined = this.title;
    if (!this.title.length && !this.message.length) {
      const randomMessage = quotes[random(0, quotes.length - 1)];
      m = randomMessage.message;
      t = randomMessage.title;
    }
    return {
      message: m,
      title: t,
    };
  }

  openToast() {
    const {message, title} = this.getMessage();
    // Clone current config so it doesn't change when ngModel updates
    const opt = cloneDeep(this.options);
    const inserted = this.toastr.show(
      message,
      title,
      opt,
      this.options.iconClasses[this.type],
    );
    if (inserted) {
      this.lastInserted.push(inserted.toastId);
    }
    return inserted;
  }

  openToastNoAnimation() {
    const {message, title} = this.getMessage();
    const opt = cloneDeep(this.options);
    opt.toastComponent = ToastNoAnimation;
    const inserted = this.toastr.show(
      message,
      title,
      opt,
      this.options.iconClasses[this.type],
    );
    if (inserted) {
      this.lastInserted.push(inserted.toastId);
    }
    return inserted;
  }

  clearToasts() {
    this.toastr.clear();
  }

  clearLastToast() {
    this.toastr.clear(this.lastInserted.pop());
  }

  fixNumber(field: string) {
    this.options[field] = Number(this.options[field]);
  }

  setInlineClass(enableInline: boolean) {
    if (enableInline) {
      this.toastr.overlayContainer = this.inlineContainers.toArray()[this.inlinePositionIndex];
      this.options.positionClass = 'inline';
    } else {
      this.toastr.overlayContainer = undefined;
      this.options.positionClass = 'toast-top-right';
    }
  }

  setInlinePosition(index: number) {
    this.toastr.overlayContainer = this.inlineContainers.toArray()[index];
  }

  setClass(enableBootstrap: boolean) {
    const add = enableBootstrap ? 'bootstrap' : 'normal';
    const remove = enableBootstrap ? 'normal' : 'bootstrap';
    this.renderer.addClass(document.body, add);
    this.renderer.removeClass(document.body, remove);
  }

}
