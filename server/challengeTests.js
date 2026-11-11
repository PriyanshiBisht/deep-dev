// ---------- small helpers shared by all tests ----------
const text = (el) => el.textContent.trim();

// "Hidden" = any of the common ways of hiding something
const isHidden = (window, el) => {
  const s = window.getComputedStyle(el);
  return (
    s.display === "none" ||
    s.visibility === "hidden" ||
    parseFloat(s.opacity) === 0 ||
    parseFloat(s.maxHeight) === 0 ||
    parseFloat(s.height) === 0
  );
};

// Type into an input the way a user would
const typeInto = (window, input, value) => {
  input.value = value;
  input.dispatchEvent(new window.Event("input", { bubbles: true }));
};

const challengeTests = {
  // =====================================================
  // 1 = Responsive Navbar
  // =====================================================
  1: [
    {
      name: "Has a .logo and a .nav-links list with 3 links inside .navbar",
      run: ({ document }) => {
        const nav = document.querySelector(".navbar");
        return (
          !!nav &&
          !!nav.querySelector(".logo") &&
          nav.querySelectorAll(".nav-links li").length === 3
        );
      },
    },
    {
      name: ".navbar is a flex container",
      run: ({ document, window }) => {
        const s = window.getComputedStyle(document.querySelector(".navbar"));
        return s.display === "flex" || s.display === "inline-flex";
      },
    },
    {
      name: "Logo is pushed to the left and links to the right",
      run: ({ document, window }) => {
        const nav = document.querySelector(".navbar");
        const navS = window.getComputedStyle(nav);
        const isFlex = navS.display === "flex" || navS.display === "inline-flex";
        const links = window.getComputedStyle(document.querySelector(".nav-links"));
        const logo = window.getComputedStyle(document.querySelector(".logo"));
        return (
          isFlex &&
          (navS.justifyContent === "space-between" ||
            links.marginLeft === "auto" ||
            logo.marginRight === "auto")
        );
      },
    },
    {
      name: "Nav links sit in a row",
      run: ({ document, window }) => {
        const list = window.getComputedStyle(document.querySelector(".nav-links"));
        const item = window.getComputedStyle(document.querySelector(".nav-links li"));
        const flexRow =
          (list.display === "flex" || list.display === "inline-flex") &&
          !String(list.flexDirection).startsWith("column");
        const inlineItems = ["inline", "inline-block", "inline-flex"].includes(item.display);
        return flexRow || inlineItems;
      },
    },
  ],

  // =====================================================
  // 2 = Accordion FAQ
  // =====================================================
  2: [
    {
      name: "Has 3 items, each with a .question and an .answer",
      run: ({ document }) => {
        const items = document.querySelectorAll(".accordion .item");
        return (
          items.length === 3 &&
          [...items].every((i) => i.querySelector(".question") && i.querySelector(".answer"))
        );
      },
    },
    {
      name: "All answers are collapsed on page load",
      run: ({ document, window }) => {
        const answers = [...document.querySelectorAll(".answer")];
        return answers.length === 3 && answers.every((a) => isHidden(window, a));
      },
    },
    {
      name: "Clicking a question expands its answer",
      run: ({ document, window }) => {
        const q = document.querySelectorAll(".question")[0];
        const a = document.querySelectorAll(".answer")[0];
        if (!isHidden(window, a)) return false; // must start collapsed
        q.click();
        return !isHidden(window, a);
      },
    },
    {
      name: "Clicking a question leaves the other answers collapsed",
      run: ({ document, window }) => {
        const questions = document.querySelectorAll(".question");
        const answers = document.querySelectorAll(".answer");
        questions[0].click();
        return (
          !isHidden(window, answers[0]) &&
          isHidden(window, answers[1]) &&
          isHidden(window, answers[2])
        );
      },
    },
    {
      name: "Clicking an open question collapses it again",
      run: ({ document, window }) => {
        const q = document.querySelectorAll(".question")[1];
        const a = document.querySelectorAll(".answer")[1];
        q.click();
        if (isHidden(window, a)) return false; // must have opened
        q.click();
        return isHidden(window, a);
      },
    },
  ],

  // =====================================================
  // 3 = Counter App
  // =====================================================
  3: [
    {
      name: "Has increment, decrement, reset buttons and a count display",
      run: ({ document }) =>
        !!document.getElementById("increment") &&
        !!document.getElementById("decrement") &&
        !!document.getElementById("reset") &&
        !!document.getElementById("count"),
    },
    {
      name: "Count starts at 0",
      run: ({ document }) => text(document.getElementById("count")) === "0",
    },
    {
      name: "Increment adds 1 per click",
      run: ({ document }) => {
        const inc = document.getElementById("increment");
        inc.click(); inc.click(); inc.click();
        return text(document.getElementById("count")) === "3";
      },
    },
    {
      name: "Decrement subtracts 1 per click",
      run: ({ document }) => {
        document.getElementById("increment").click();
        document.getElementById("increment").click();
        document.getElementById("decrement").click();
        return text(document.getElementById("count")) === "1";
      },
    },
    {
      name: "Count never goes below 0",
      run: ({ document }) => {
        const count = () => text(document.getElementById("count"));
        document.getElementById("increment").click();
        if (count() !== "1") return false; // the counter must work first
        document.getElementById("decrement").click();
        document.getElementById("decrement").click();
        document.getElementById("decrement").click();
        return count() === "0";
      },
    },
    {
      name: "Reset brings the count back to 0",
      run: ({ document }) => {
        const count = () => text(document.getElementById("count"));
        document.getElementById("increment").click();
        document.getElementById("increment").click();
        if (count() !== "2") return false; // must be 2 before we reset
        document.getElementById("reset").click();
        return count() === "0";
      },
    },
  ],

  // =====================================================
  // 4 = Pricing Cards
  // =====================================================
  4: [
    {
      name: "Has 3 cards (Basic, Pro, Enterprise) with Pro marked .popular",
      run: ({ document }) => {
        const cards = [...document.querySelectorAll(".pricing .card")];
        const popular = document.querySelectorAll(".pricing .popular");
        return (
          cards.length === 3 &&
          text(cards[0]).includes("Basic") &&
          text(cards[1]).includes("Pro") &&
          text(cards[2]).includes("Enterprise") &&
          popular.length === 1 &&
          popular[0] === cards[1]
        );
      },
    },
    {
      name: "Cards sit in a row",
      run: ({ document, window }) => {
        const wrap = window.getComputedStyle(document.querySelector(".pricing"));
        const card = window.getComputedStyle(document.querySelector(".card"));
        const flexRow =
          (wrap.display === "flex" || wrap.display === "inline-flex") &&
          !String(wrap.flexDirection).startsWith("column");
        const grid = wrap.display === "grid" && !!wrap.gridTemplateColumns;
        const inlineCards = ["inline", "inline-block"].includes(card.display);
        return flexRow || grid || inlineCards;
      },
    },
    {
      name: "There is space between the cards",
      run: ({ document, window }) => {
        const wrap = window.getComputedStyle(document.querySelector(".pricing"));
        const card = window.getComputedStyle(document.querySelector(".card"));
        const px = (v) => parseFloat(v) || 0;
        return (
          px(wrap.gap) > 0 ||
          px(wrap.columnGap) > 0 ||
          px(card.marginLeft) > 0 ||
          px(card.marginRight) > 0
        );
      },
    },
    {
      name: "The popular card looks different from the others",
      run: ({ document, window }) => {
        const popular = window.getComputedStyle(document.querySelector(".popular"));
        const normal = window.getComputedStyle(
          document.querySelector(".card:not(.popular)")
        );
        const props = [
          "borderColor", "borderWidth", "backgroundColor", "background",
          "boxShadow", "transform", "fontWeight", "color", "outline",
        ];
        return props.some((p) => popular[p] !== normal[p]);
      },
    },
  ],

  // =====================================================
  // 5 = Debounced Search Bar
  // =====================================================
  5: [
    {
      name: "Has a #search input and a #result element",
      run: ({ document }) =>
        !!document.getElementById("search") && !!document.getElementById("result"),
    },
    {
      name: "Result is empty before typing",
      run: ({ document }) => text(document.getElementById("result")) === "",
    },
    {
      name: "Shows the typed text after a 500ms pause",
      run: ({ document, window }) => {
        typeInto(window, document.getElementById("search"), "react");
        window.__tick(500);
        return text(document.getElementById("result")).includes("react");
      },
    },
    {
      name: "Does not update before 500ms have passed",
      run: ({ document, window }) => {
        const result = document.getElementById("result");
        typeInto(window, document.getElementById("search"), "react");
        window.__tick(499);
        if (text(result) !== "") return false; // too early
        window.__tick(1);
        return text(result).includes("react"); // ...but it must appear on time
      },
    },
    {
      name: "Typing again restarts the 500ms wait",
      run: ({ document, window }) => {
        const result = document.getElementById("result");
        const input = document.getElementById("search");
        typeInto(window, input, "re");
        window.__tick(300);
        typeInto(window, input, "react");
        window.__tick(300); // only 300ms since the last keystroke
        if (text(result) !== "") return false;
        window.__tick(200); // now 500ms since the last keystroke
        return text(result).includes("react");
      },
    },
  ],

  // =====================================================
  // 6 = Modal Popup
  // =====================================================
  6: [
    {
      name: "Has an open button, an overlay and a close button inside it",
      run: ({ document }) => {
        const overlay = document.getElementById("overlay");
        return (
          !!document.getElementById("openBtn") &&
          !!overlay &&
          !!overlay.querySelector("#closeBtn")
        );
      },
    },
    {
      name: "Modal is hidden on page load",
      run: ({ document, window }) =>
        isHidden(window, document.getElementById("overlay")),
    },
    {
      name: "Open button shows the modal",
      run: ({ document, window }) => {
        const overlay = document.getElementById("overlay");
        if (!isHidden(window, overlay)) return false; // must start hidden
        document.getElementById("openBtn").click();
        return !isHidden(window, overlay);
      },
    },
    {
      name: "Close button hides the modal",
      run: ({ document, window }) => {
        const overlay = document.getElementById("overlay");
        if (!isHidden(window, overlay)) return false;
        document.getElementById("openBtn").click();
        if (isHidden(window, overlay)) return false; // must have opened
        document.getElementById("closeBtn").click();
        return isHidden(window, overlay);
      },
    },
    {
      name: "Clicking the dark backdrop hides the modal",
      run: ({ document, window }) => {
        const overlay = document.getElementById("overlay");
        if (!isHidden(window, overlay)) return false;
        document.getElementById("openBtn").click();
        if (isHidden(window, overlay)) return false;
        overlay.click();
        return isHidden(window, overlay);
      },
    },
    {
      name: "Clicking inside the modal box keeps it open",
      run: ({ document, window }) => {
        const overlay = document.getElementById("overlay");
        if (!isHidden(window, overlay)) return false;
        document.getElementById("openBtn").click();
        if (isHidden(window, overlay)) return false;
        overlay.querySelector(".modal").click();
        return !isHidden(window, overlay);
      },
    },
  ],
};

module.exports = challengeTests;