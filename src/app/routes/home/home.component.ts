import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, WritableSignal, signal } from '@angular/core';
import { invoke } from '@tauri-apps/api/core';

@Component({
    selector: 'app-home',
    imports: [CommonModule],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
    greetingMessage: WritableSignal<string> = signal('');

    greet(event: SubmitEvent, name: string): void {
        event.preventDefault();

        // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
        invoke<string>('greet', { name }).then((text) => {
            this.greetingMessage.set(text);
        });
    }
}
