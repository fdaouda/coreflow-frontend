import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { OrderService } from './services/order.service';
import { AiService } from './services/ai.service';
import { OrderResponseDto } from '@dtos/order-response.dto';

interface ChatMessage {
  sender: 'USER' | 'AI';
  text: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, DatePipe], // 👈 Import des modules nécessaires directement dans le composant
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  private orderService = inject(OrderService);
  private aiService = inject(AiService);

  // Tableau magique réactif (Signals)
  orders = signal<OrderResponseDto[]>([]);
  chatMessages = signal<ChatMessage[]>([]);
  userPrompt = signal<string>('');
  isLoadingAi = signal<boolean>(false);

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getOrders().subscribe({
      next: (data) => this.orders.set(data),
      error: (err) => console.error('Erreur chargement des commandes :', err)
    });
  }

  sendToAi(): void {
    const prompt = this.userPrompt().trim();
    if (!prompt) return;

    // Ajout du message utilisateur au chat via .update()
    this.chatMessages.update(msgs => [...msgs, { sender: 'USER', text: prompt }]);
    this.userPrompt.set('');
    this.isLoadingAi.set(true);

    this.aiService.askAgent(prompt).subscribe({
      next: (response) => {
        this.chatMessages.update(msgs => [...msgs, { sender: 'AI', text: response }]);
        this.isLoadingAi.set(false);
        // Rechargement automatique pour voir si l'agent IA a créé/modifié une commande !
        this.loadOrders();
      },
      error: () => {
        this.chatMessages.update(msgs => [...msgs, { sender: 'AI', text: 'Erreur de connexion avec l’agent IA.' }]);
        this.isLoadingAi.set(false);
      }
    });
  }
}
