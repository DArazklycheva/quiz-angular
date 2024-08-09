import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth/auth.service';
import { TestService } from 'src/app/shared/services/test.service';
import { DefaultResponseType } from 'src/types/default-response.type';
import { QuizListType } from 'src/types/quiz-list.type';
import { TestResultType } from 'src/types/test-result.type';

@Component({
  selector: 'app-choice',
  templateUrl: './choice.component.html',
  styleUrls: ['./choice.component.scss']
})
export class ChoiceComponent implements OnInit {

  quizzes: QuizListType[] = [];
  private testResult: TestResultType[] | null = null;

  constructor(private testService: TestService, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.testService.getTests()
      .subscribe((result: QuizListType[]) => {
        this.quizzes = result;

        const userInfo = this.authService.getUserInfo();
        if (userInfo) {
          this.testService.getUserResults(userInfo.userId)
            .subscribe((result: DefaultResponseType | TestResultType[]) => {
              if (result) {
                if ((result as DefaultResponseType).error !== undefined) {
                  throw new Error((result as DefaultResponseType).message);
                }

                const testResult = result as TestResultType[];
                if (testResult) {
                  this.quizzes = this.quizzes.map(quiz => {
                    const foundItem: TestResultType | undefined = testResult.find(item => item.testId === quiz.id);
                    if (foundItem) {
                      quiz.result = foundItem.score + '/' + foundItem.total;
                    }
                    return quiz;
                  });
                }
              }
            });
        }
      });
  }

  chooseQuiz(id: number): void {
    this.router.navigate(['/test', id]);
  }
}
