import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AiService {
  private http = inject(HttpClient);

  // ⚠️ Ajuste le port/URL selon le Controller Spring AI de ton backend
  private apiUrl = 'http://localhost:8080/api/ai/chat';

  /**
   * Envoie une consigne en langage naturel à l'agent Spring AI.
   * @param prompt La question ou commande de l'utilisateur
   * @returns Un Observable contenant la réponse de l'agent IA
   */
  askAgent(prompt: string): Observable<string> {
    return this.http.post(
      this.apiUrl,
      { prompt },
      { responseType: 'text' } // Indique à Angular de ne pas tenter de parser du JSON si Spring AI renvoie du texte brut
    );
  }
}
