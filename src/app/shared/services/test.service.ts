import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DefaultResponseType } from 'src/types/default-response.type';
import { PassTestResponseType } from 'src/types/pass-test-response.type';
import { QuizListType } from 'src/types/quiz-list.type';
import { QuizType } from 'src/types/quiz.type';
import { TestResultType } from 'src/types/test-result.type';
import { UserResultType } from 'src/types/user-result.type';

@Injectable({
  providedIn: 'root'
})
export class TestService {

  constructor(private http: HttpClient) { }

  getTests(): Observable<QuizListType[]> {
    return this.http.get<QuizListType[]>(environment.apiHost + 'tests')
  }

  getUserResults(userId: number): Observable<DefaultResponseType | TestResultType[]> {
    return this.http.get<DefaultResponseType | TestResultType[]>(environment.apiHost + 'tests/results?userId=' + userId)
  }

  getQuiz(id: number | string): Observable<DefaultResponseType | QuizType> {
    return this.http.get<DefaultResponseType | QuizType>(environment.apiHost + 'tests/' + id)
  }

  passQuiz(id: number | string, userId: string | number, userResult: UserResultType[]): Observable<DefaultResponseType | PassTestResponseType> {
    return this.http.post<DefaultResponseType | PassTestResponseType>(environment.apiHost + 'tests/' + id + '/pass',
      {
        userId: userId,
        results: userResult
      });
  }

  getResult(id: number | string, userId: string | number): Observable<DefaultResponseType | PassTestResponseType> {
    return this.http.get<DefaultResponseType | PassTestResponseType>(environment.apiHost + 'tests/' + id + '/result?userId=' + userId)
  }
}
