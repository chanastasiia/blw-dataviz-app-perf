/* import "./UserPoll.css";
import {
  CurrentPageStoreContext,
  UserResponsesStoreContext,
} from "../../Contexts";
import questions from "../../data/questions.json";
import { use, useState, useEffect } from "react";
import Question from "./Question";
import ResponseFieldSet from "./ResponseFieldSet";
import classNames from "classnames";

export default function UserPoll({ question }: { question: "imp" | "perf" }) {
  const UserResponsesStore = use(UserResponsesStoreContext);
  const CurrentPageStore = use(CurrentPageStoreContext);
  const [isOpen, setIsOpen] = useState(true);
  function toggleOpen() {
    if (CurrentPageStore.currentPage >= 1) {
      setIsOpen((prevOpen) => !prevOpen);
    }
  }
  useEffect(() => {
    if (CurrentPageStore.currentPage > 0) {
      setIsOpen(false);
    }
  }, [CurrentPageStore.currentPage]);

  const selectedPrompts = questions.prompts.filter((q) =>
    Object.keys(UserResponsesStore.userResponses).includes(q.variable_name)
  );

  return (
    <div className={classNames("poll-display", { open: isOpen })}>
      <Question question={question} isOpen={isOpen} toggleOpen={toggleOpen} />
      {isOpen && (
        <div className="user-poll">
          {selectedPrompts.map((prompt) => (
            <div
              className="poll-item"
              key={`${question}_${prompt.variable_name}`}
            >
              <p>{prompt.question_text}</p>
              <ResponseFieldSet prompt={prompt} question={question} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
*/

import "./UserPoll.css";
import {
  CurrentPageStoreContext,
  UserResponsesStoreContext,
} from "../../Contexts";
import questions from "../../data/questions.json";
import { use, useState, useEffect } from "react";
import ResponseFieldSet from "./ResponseFieldSet";
import classNames from "classnames";

export default function UserPoll() {
  const UserResponsesStore = use(UserResponsesStoreContext);
  const CurrentPageStore = use(CurrentPageStoreContext);
  const [isOpen, setIsOpen] = useState(true);

  function toggleOpen() {
    if (CurrentPageStore.currentPage >= 1) {
      setIsOpen((prevOpen) => !prevOpen);
    }
  }

  useEffect(() => {
    if (CurrentPageStore.currentPage > 0) {
      setIsOpen(false);
    }
  }, [CurrentPageStore.currentPage]);

  const selectedPrompts = questions.prompts.filter((q) =>
    Object.keys(UserResponsesStore.userResponses).includes(q.variable_name)
  );

  return (
    <div className={classNames("poll-display", { open: isOpen })}>
      <div className="sticky-header">
        <div className="poll-header" onClick={toggleOpen}>
          <h2>What do you think?</h2>
          <svg
            className={classNames("accordion-arrow", { rotated: isOpen })}
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 8L10 12L14 8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {selectedPrompts.length > 0 && (
          <div className="sticky-principle">
            <p>{selectedPrompts[0].question_text}</p>
          </div>
        )}
      </div>

      {isOpen && (
        <div className="scrollable-content">
          {selectedPrompts.map((prompt) => (
            <div className="poll-item" key={prompt.variable_name}>
              <p className="poll-subheading">
                How important is this for democratic government?
              </p>
              <ResponseFieldSet prompt={prompt} question="imp" />

              <p className="poll-subheading">
                How well does this describe the US as of today?
              </p>
              <ResponseFieldSet prompt={prompt} question="perf" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
