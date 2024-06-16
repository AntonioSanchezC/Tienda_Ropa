<?php

namespace App\Listeners;

use App\Events\SendEmailEvent;
use App\Mail\YourEmailMailable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Mail;

class SendEmailListener
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(SendEmailEvent $event): void
    {
        // Mail::to($event->user->email)->send(new YourEmailMailable($event->user));

    }
}
