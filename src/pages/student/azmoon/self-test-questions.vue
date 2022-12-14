<template>
  <DesktopMinimalHeader v-if="!mobile" />
  <!-- Spinner -->
  <div class="loader-parent" v-if="isFetching">
    <div class="loading1"></div>
  </div>
  <!--  -->

  <div class="self-test-questions" v-else>
    <SelfTestFinish v-if="showSelfTestFinish" :session="session" />
    <Header />
    <MinimalHeader
      :title="`
     امتیازات کسب شده :
          ${toPersianNumbers(store.getters.getCurrentStudent.point)}
    `"
    />

    <!-- Progress Bar And Count -->

    <div class="progress-count animate__animated animate__fadeIn">
      <div class="count">
        <span>
          {{ title }}
        </span>
        <!-- Change This And Width Of The Progress Bar Dynamically -->
        <span>
          {{ toPersianNumbers(`${currentQuestionIndex + 1}`) }}/{{
            toPersianNumbers(`${questions[currentChunk].length}`)
          }}
        </span>
      </div>
      <div class="progress" style="height: 5px">
        <div
          class="progress-bar bg-success"
          role="progressbar"
          :style="` width : ${
            (currentQuestionIndex / questions[currentChunk].length) * 100 + 10
          }% `"
          aria-valuenow="25"
          aria-valuemin="0"
          aria-valuemax="100"
        ></div>
      </div>
    </div>

    <!-- Quiz Card -->

    <div class="quiz-card shadow animate__animated animate__fadeIn">
      <div class="number-of-question" style="font-weight: 600">
        <span> {{ currentQuestionIndex + 1 }}. </span>

        <img
          src="@/assets/img/azmoon-icons/img-icon@3x.png"
          v-if="questions[currentChunk][currentQuestionIndex].images.length"
          class="img-icon"
          @click="
            setCurrentImages(
              questions[currentChunk][currentQuestionIndex].images
            )
          "
          alt="question icon"
        />
      </div>

      <h5>
        <!-- Change This With Real Data Of Question -->
        {{ questions[currentChunk][currentQuestionIndex].text || '' }}
      </h5>
      <div class="quiz-card-container" v-if="questions[currentChunk]">
        <div
          v-for="(option, index) in questions[currentChunk][
            currentQuestionIndex
          ].options"
          :class="`${
            questions[currentChunk][currentQuestionIndex].answer - 1 === index
              ? 'card success animate__animated animate__fadeIn'
              : 'card animate__animated animate__fadeIn'
          }`"
          :key="option._id"
          @click.self="changeQuestionsAnswer(index)"
        >
          <p v-if="option.text">
            <!-- Answer Text -->
            {{ option.text }}
          </p>

          <span v-else> .. </span>

          <div class="imgs">
            <img
              src="@/assets/img/azmoon-icons/img-icon@3x.png"
              v-if="option.images.length"
              class="img-icon"
              @click="setCurrentImages(option.images)"
              alt="question img"
            />
            <div class="img">
              <img
                src="@/assets/img/accept-path-light.png"
                alt="active"
                @click="changeQuestionsAnswer(index)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Buttons -->
    <div class="btns animate__animated animate__fadeIn">
      <button
        class="red"
        v-if="currentQuestionIndex + 1 != questions[currentChunk].length"
        @click="showNextQuestion"
      >
        بعدی
      </button>

      <button
        class="red"
        @click="showPreviousQuestion"
        v-if="currentQuestionIndex - 1 >= 0"
      >
        قبلی
      </button>

      <!-- Show If More Questions Are There To load  -->
      <button
        class="red"
        v-if="
          currentQuestionIndex + 1 == questions[currentChunk].length &&
          !!model.questions[currentChunk + 1]
        "
        @click="moreQuestionsRequest"
      >
        سوالات بیشتر <i class="fas fa-arrow-right"></i>
      </button>

      <button v-else class="red" @click="submitSelfTest">
        اتمام و ثبت آزمون خودسنجی
      </button>

      <img
        src="@/assets/img/bookmark-light@2x.png"
        @click="bookmarkQuestion(questions[currentChunk][currentQuestionIndex])"
        class="img"
        v-if="!isBookmarked()"
        alt="bookmark light"
      />
      <img
        src="@/assets/img/bookmark@2x.png"
        @click="bookmarkQuestion(questions[currentChunk][currentQuestionIndex])"
        class="img"
        v-else-if="!!isBookmarked()"
        alt="bookmark "
      />
    </div>
  </div>
  <!--  -->
  <ShowImages
    :images="JSON.stringify(currentImages)"
    v-if="showImages"
    @convertBoolean="showImages = false"
  />
  <!--  -->
</template>

<script lang="ts" setup>
import { ref, onBeforeMount } from 'vue';
import MinimalHeader from '@/modules/student-modules/header/minimal-header.vue';
import { StudentSelfTestApi } from '@/api/services/student/student-selftest-service';
import { StudentExamApi } from '@/api/services/student/student-exam-service';
import { toPersianNumbers } from '@/utilities/to-persian-numbers';
import { store } from '@/store';
import { useRoute } from 'vue-router';
import ShowImages from '@/modules/student-modules/show-images.vue';
import DesktopMinimalHeader from '@/modules/student-modules/header/desktop-minimal.vue';
import alertify from '@/assets/alertifyjs/alertify';
import Header from '@/modules/student-modules/header/header.vue';
import { AxiosError } from 'axios';
import SelfTestFinish from '@/modules/student-modules/azmoon/self-test-finish.vue';
import router from '@/router';

const route = useRoute();
const id = route.params.id as string;
const title = ref('');

const isFetching = ref(true);

const model = ref({} as any);

const questions = ref([] as any);
// const currentQuestion = ref({} as any)
const currentQuestionIndex = ref(0);

const currentChunk = ref(0);

const allBookmarkedQuestions = ref([] as any);

const currentImages = ref([] as any);

const showImages = ref(false);

const session = ref({});

const showSelfTestFinish = ref(false);

const setCurrentImages = (images) => {
  if (images.length) currentImages.value = images;
  showImages.value = true;
};

const fetchNextQuestionsChunk = async () => {
  const tmpArray = [] as any;

  const listOfPromises = [] as any;

  // If no More Chunks
  if (!model.value.questions?.[currentChunk.value]) return;
  // Push Every Promise of Question to It's List
  for (let i = 0; i < model.value.questions[currentChunk.value].length; i++) {
    const question = model.value.questions[currentChunk.value][i];
    console.log(question);
    if (!question) break;
    listOfPromises.push(StudentExamApi.getOneQuestion(question));
  }

  // When It's done add it to list of questions

  const questionsPromise = await Promise.all(listOfPromises);

  questionsPromise.forEach((question: any, i) => {
    tmpArray[i] = {
      ...question.data.data,
      answer: null,
      correct: i
    };
  });
  //  finally Split The Questions to array of 10
  for (let i = 0, j = tmpArray.length; i < j; i += 10)
    questions.value.push(tmpArray.slice(i, i + 10));
};

onBeforeMount(async () => {
  // Get The Title and details of that session
  const resForModel = await StudentSelfTestApi.getOneSession(id);

  model.value = resForModel.data.data;
  model.value;
  title.value = `${resForModel.data.data.title} ${model.value.course.title}`;
  // Check For Duplicate Exam And increase currentChunk if true
  const res = await StudentSelfTestApi.selfTestResult({
    course: model.value.course._id,
    session: model.value._id
  });
  // Cut This many questions off because they have been answered before
  const amountToslice = res.data.data.totalQuestion;

  model.value.questions.splice(0, amountToslice);

  // Split Array BY smaller Arrays
  const amoutToSplit = Math.ceil(model.value.questions.length / 10);

  const temp = model.value.questions;
  model.value.questions = [];

  for (let i = 0; i < amoutToSplit; i++) {
    model.value.questions.push(temp.splice(0, 10));
  }

  console.log(model.value.questions);
  await fetchNextQuestionsChunk();

  isFetching.value = false;
});

const moreQuestionsRequest = async () => {
  const arrayToSend = questions.value[currentChunk.value].map((question) => {
    return {
      question: { _id: question._id },
      answer: question.answer,
      correct: question.correct
    };
  });

  try {
    const res = await StudentSelfTestApi.registerSelfTest({
      course: { _id: model.value.course._id },
      session: { _id: model.value._id },
      answers: arrayToSend
    });

    if (res.data.status == 0 || res.data.status == 200) {
      currentQuestionIndex.value = 0;
      currentChunk.value = currentChunk.value + 1;
      //

      isFetching.value = true;
      await fetchNextQuestionsChunk();
      isFetching.value = false;
    }
  } catch (error) {
    alertify.error((error as AxiosError).message);
  }
};

const submitSelfTest = async () => {
  const dataForSend = await StudentSelfTestApi.selfTestResult({
    course: { _id: model.value.course._id },
    session: { _id: id }
  });

  session.value = dataForSend.data.data;
  showSelfTestFinish.value = true;
  return;
  //
  const arrayToSend = questions.value[currentChunk.value].map((question) => {
    return {
      question: { _id: question._id },
      answer: question.answer,
      correct: question.correct
    };
  });

  const res = await StudentSelfTestApi.registerSelfTest({
    course: { _id: model.value.course._id },
    session: { _id: model.value._id },
    answers: arrayToSend
  });

  if (res.data.status == 0 || res.data.status == 200 || res.data) {
    currentQuestionIndex.value = 0;
    currentChunk.value = 0;
    //
    if (!questions.value[currentChunk.value + 1]) {
      const dataForSend = await StudentSelfTestApi.selfTestResult({
        course: { _id: model.value.questions[currentChunk.value][0].course },
        session: { _id: id }
      });

      session.value = dataForSend.data.data;
      //
      showSelfTestFinish.value = true;
    } else {
      const dataForSend = await StudentSelfTestApi.selfTestResult({
        course: { _id: model.value.questions[currentChunk.value][0].course },
        session: { _id: id }
      });

      session.value = dataForSend.data.data;
      showSelfTestFinish.value = true;

      // alertify.success('امتحان شما با موفقیت ثبت شد');
      // router.push({
      //   name: 'SelfTest'
      // });
    }
  }
};

// Make The Answer the clicked one 1 based instead of zero

const changeQuestionsAnswer = (idx: number) =>
  (questions.value[currentChunk.value][currentQuestionIndex.value].answer =
    idx + 1);

const showNextQuestion = () => {
  if (
    currentQuestionIndex.value + 1 <
    questions.value[currentChunk.value].length
  )
    currentQuestionIndex.value++;
};

const showPreviousQuestion = () => {
  if (currentQuestionIndex.value - 1 >= 0) currentQuestionIndex.value--;
};

const isBookmarked = () => {
  let item = allBookmarkedQuestions.value.find((item) => {
    if (questions.value[currentChunk.value]) {
      return (
        item.question._id ===
        questions.value[currentChunk.value][currentQuestionIndex.value]._id
      );
    }
  });

  return item || false;
};

(async () => {
  const res = await StudentSelfTestApi.AllBookmarkQuestions();
  res.data.data.forEach((question) => {
    if (question.question != null) {
      allBookmarkedQuestions.value.push(question);
    }
  });
})();

const bookmarkQuestion = async (question) => {
  const isBookmark = isBookmarked();

  const tmp = {
    question: { _id: question._id },
    session: { _id: question.session._id },
    course: { _id: question.course._id }
  };

  // If The Question Is Not Bookmarked
  if (!isBookmark) await StudentSelfTestApi.bookmarkQuestion(tmp);
  else if (isBookmark)
    await StudentSelfTestApi.unBookmarkQuestion(isBookmark._id);

  // Re Fill The Bookmarked Array
  const res = await StudentSelfTestApi.AllBookmarkQuestions();
  allBookmarkedQuestions.value = [];
  res.data.data.forEach((question) => {
    if (question.question != null) allBookmarkedQuestions.value.push(question);
  });
};
</script>

<style lang="scss" scoped>
@import '@/css-variable//Global.scss';
.self-test-questions {
  width: 100%;
  min-height: 100%;
  position: relative;
  overflow-x: hidden;
  max-width: 1000px;

  .progress-count {
    width: 100%;
    padding: 1rem;
    .count {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 0.5rem;
      font-family: IRANSans;
      color: #171717;

      span {
        &:first-child {
          font-size: 14px;
          font-weight: bold;
        }
      }
    }
  }

  .quiz-card {
    width: 95%;
    margin: 1rem auto;
    background-color: #fff;
    padding: 0.7rem;
    border-radius: 25px;
    white-space: wrap;
    word-wrap: break-word;

    h5 {
      margin: 25px 0 2.2rem;
      font-family: IRANSans;
      font-size: 14px;
      font-weight: bold;
      text-align: right;
      color: #171717;
      line-height: 1.4;
    }

    .quiz-card-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      white-space: wrap;
      word-wrap: break-word;

      .card {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1rem;
        border: solid 1px #c1c1c193;
        background: #fff;
        width: 100%;
        flex-direction: row;
        border-radius: 18px;
        min-height: 4.5rem;
        white-space: wrap;
        word-wrap: break-word;

        p {
          display: block;
          font-family: IRANSans;
          font-size: 13px;
          font-weight: bold;
          color: #646464;
          white-space: break-spaces;
          word-break: break-word;
        }

        .imgs {
          display: flex;
          align-items: center;
          justify-content: center;

          & > * {
            margin: 0 0.1rem;
          }
        }

        .img-icon {
          width: 27px;
          height: 27px;
          aspect-ratio: 1;
        }

        .img {
          width: 27px;
          height: 27px;
          padding: 7px;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #fff;
          border: solid 1px #c1c1c193;

          img {
            object-fit: contain;
          }
        }
      }
      // Success Class
      .success {
        border: solid 1px #3fca60;

        span {
          color: #3fca60;
        }
        .img {
          background: #3fca60;
        }
      }
    }
  }

  .btns {
    width: 90%;
    margin: 2.5rem auto 0.8rem auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: nowrap;
    gap: 0.5rem;

    .img {
      max-width: 3rem;
    }

    button {
      flex-grow: 1;
      padding: 0.75rem 0.8rem;
      border-radius: 10px;
      border: none;
      font-family: IRANSans;
      font-size: 0.615rem;
      font-weight: bold;
      text-align: center;
      color: #fff;
      height: 3rem;
    }

    .red {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: $redish-background;
      flex-direction: row-reverse;
      color: #fff;

      i {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: 0.3rem;
        width: 24px;
        height: 24px;
        background: red;
        border-radius: 50%;
      }
    }

    .green {
      background-color: #3fca60;
      color: #fff;
    }
  }
}
</style>
