document.addEventListener("DOMContentLoaded", () => {
  const cepModal = document.getElementById("cepModal");
  const cepInput = document.getElementById("cep");
  const cepLoading = document.getElementById("cepLoading");
  const cepError = document.getElementById("cepError");
  const cepSuccess = document.getElementById("cepSuccess");
  const cepCity = document.getElementById("cepCity");
  const btnConfirmCep = document.getElementById("btnConfirmCep");
  const btnResetCep = document.getElementById("btnResetCep");

  let cepData = null;

  const savedCepData = localStorage.getItem("shopee_delivery_cep_data");
  if (!savedCepData) {
    cepModal.classList.remove("hidden");
  } else {
    try {
      cepData = JSON.parse(savedCepData);
    } catch (error) {
      console.error("Error parsing CEP data from localStorage:", error);
      localStorage.removeItem("shopee_delivery_cep_data");
      cepModal.classList.remove("hidden");
    }
  }

  cepInput.addEventListener("input", (e) => {
    let value = e.target.value.replace(/\D/g, "");

    if (value.length > 5) {
      value = `${value.slice(0, 5)}-${value.slice(5, 8)}`;
    }

    e.target.value = value;

    btnConfirmCep.disabled = value.replace("-", "").length !== 8;

    if (btnConfirmCep.disabled) {
      btnConfirmCep.textContent = "Verificar CEP";
    }
  });

  btnConfirmCep.addEventListener("click", async () => {
    const cep = cepInput.value.replace(/\D/g, "");

    if (cep.length !== 8) {
      return;
    }

    if (btnConfirmCep.textContent === "Confirmar") {
      cepModal.classList.add("hidden");
      loadJobOpenings();
      return;
    }

    cepLoading.classList.remove("hidden");
    cepError.classList.add("hidden");
    cepSuccess.classList.add("hidden");
    btnConfirmCep.disabled = true;

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (data.erro) {
        throw new Error("CEP não encontrado");
      }

      cepData = {
        cep: data.cep,
        city: data.localidade,
        state: data.uf,
      };

      cepCity.textContent = `${data.localidade}/${data.uf}`;
      cepSuccess.classList.remove("hidden");
      btnResetCep.classList.remove("hidden");
      btnConfirmCep.textContent = "Confirmar";
      btnConfirmCep.disabled = false;

      localStorage.setItem("shopee_delivery_cep_data", JSON.stringify(cepData));
    } catch (error) {
      cepError.textContent =
        error.message || "Erro ao verificar CEP. Tente novamente.";
      cepError.classList.remove("hidden");
      btnConfirmCep.disabled = false;
    } finally {
      cepLoading.classList.add("hidden");
    }
  });

  btnResetCep.addEventListener("click", () => {
    cepInput.value = "";
    cepSuccess.classList.add("hidden");
    btnResetCep.classList.add("hidden");
    btnConfirmCep.textContent = "Verificar CEP";
    btnConfirmCep.disabled = true;
    cepData = null;
  });

  const carousel = document.querySelector(".carousel");
  const carouselInner = document.getElementById("carouselInner");
  const prevButton = document.getElementById("prevButton");
  const nextButton = document.getElementById("nextButton");
  const slides = document.querySelectorAll(".carousel-item");
  const slideCount = slides.length;
  let currentSlide = 0;

  const showSlide = (index) => {
    let newIndex = index;
    if (index >= slideCount) {
      newIndex = 0;
    } else if (index < 0) {
      newIndex = slideCount - 1;
    }

    currentSlide = newIndex;
    carouselInner.style.transform = `translateX(-${newIndex * 100}%)`;
  };

  prevButton.addEventListener("click", (e) => {
    e.preventDefault();
    showSlide(currentSlide - 1);
  });

  nextButton.addEventListener("click", (e) => {
    e.preventDefault();
    showSlide(currentSlide + 1);
  });

  setInterval(() => {
    showSlide(currentSlide + 1);
  }, 5000);

  const faqQuestions = document.querySelectorAll(".faq-question");

  faqQuestions.forEach((question) => {
    question.addEventListener("click", () => {
      const answer = question.nextElementSibling;
      const icon = question.querySelector("i");

      answer.classList.toggle("hidden");

      if (answer.classList.contains("hidden")) {
        icon.classList.remove("fa-chevron-up");
        icon.classList.add("fa-chevron-down");
      } else {
        icon.classList.remove("fa-chevron-down");
        icon.classList.add("fa-chevron-up");
      }
    });
  });

  async function loadJobOpenings() {
    const loadingJobs = document.getElementById("loadingJobs");
    const jobError = document.getElementById("jobError");
    const jobsList = document.getElementById("jobsList");
    const jobsGrid = document.getElementById("jobsGrid");

    const userData = localStorage.getItem("shopee_delivery_cep_data");
    if (!userData) {
      cepModal.classList.remove("hidden");
      return;
    }

    const { state } = JSON.parse(userData);

    try {
      loadingJobs.classList.remove("hidden");
      jobError.classList.add("hidden");
      jobsList.classList.add("hidden");

      jobsGrid.innerHTML = "";

      const regions = [
        {
          name: "Acre",
          abbr: "AC",
          vacancies: 4,
        },
        {
          name: "Alagoas",
          abbr: "AL",
          vacancies: 5,
        },
        {
          name: "Amapá",
          abbr: "AP",
          vacancies: 3,
        },
        {
          name: "Amazonas",
          abbr: "AM",
          vacancies: 7,
        },
        {
          name: "Bahia",
          abbr: "BA",
          vacancies: 10,
        },
        {
          name: "Ceará",
          abbr: "CE",
          vacancies: 8,
        },
        {
          name: "Distrito Federal",
          abbr: "DF",
          vacancies: 12,
        },
        {
          name: "Espírito Santo",
          abbr: "ES",
          vacancies: 6,
        },
        {
          name: "Goiás",
          abbr: "GO",
          vacancies: 9,
        },
        {
          name: "Maranhão",
          abbr: "MA",
          vacancies: 5,
        },
        {
          name: "Mato Grosso",
          abbr: "MT",
          vacancies: 6,
        },
        {
          name: "Mato Grosso do Sul",
          abbr: "MS",
          vacancies: 5,
        },
        {
          name: "Minas Gerais",
          abbr: "MG",
          vacancies: 14,
        },
        {
          name: "Pará",
          abbr: "PA",
          vacancies: 7,
        },
        {
          name: "Paraíba",
          abbr: "PB",
          vacancies: 5,
        },
        {
          name: "Paraná",
          abbr: "PR",
          vacancies: 11,
        },
        {
          name: "Pernambuco",
          abbr: "PE",
          vacancies: 9,
        },
        {
          name: "Piauí",
          abbr: "PI",
          vacancies: 4,
        },
        {
          name: "Rio de Janeiro",
          abbr: "RJ",
          vacancies: 18,
        },
        {
          name: "Rio Grande do Norte",
          abbr: "RN",
          vacancies: 5,
        },
        {
          name: "Rio Grande do Sul",
          abbr: "RS",
          vacancies: 12,
        },
        {
          name: "Rondônia",
          abbr: "RO",
          vacancies: 4,
        },
        {
          name: "Roraima",
          abbr: "RR",
          vacancies: 3,
        },
        {
          name: "Santa Catarina",
          abbr: "SC",
          vacancies: 10,
        },
        {
          name: "São Paulo",
          abbr: "SP",
          vacancies: 26,
        },
        {
          name: "Sergipe",
          abbr: "SE",
          vacancies: 4,
        },
        {
          name: "Tocantins",
          abbr: "TO",
          vacancies: 4,
        },
      ];

      const processedRegions = regions.map((region) => {
        if (region.abbr === state) {
          return {
            ...region,
            vacancies: 22,
            isUserState: true,
          };
        }
        return { ...region, isUserState: false };
      });

      processedRegions.forEach((region) => {
        const hasVacancies = region.vacancies > 0;
        const isUserState = region.isUserState === true;

        const jobCard = document.createElement("div");
        jobCard.className =
          "p-4 sm:p-6 hover:bg-gray-50 transition-colors duration-200";

        jobCard.innerHTML = `
            <div class="flex justify-between items-start mb-3">
              <div>
            <span class="text-sm sm:text-base font-medium text-gray-700">
              ${region.name} <span class="text-gray-500">(${region.abbr})</span>
            </span>
              </div>
              <div class="${
                hasVacancies ? "bg-red-100" : "bg-gray-200"
              } px-3 py-1 rounded-[3px]">
            <span class="${
              hasVacancies ? "text-red-600" : "text-gray-500"
            } text-sm sm:text-base font-semibold">
              ${
                hasVacancies
                  ? `<span class="font-bold">${region.vacancies}</span> vagas`
                  : "Sem vagas"
              }
            </span>
              </div>
            </div>
            <button 
              class="w-full ${
                hasVacancies
                  ? "bg-[#df4e22] hover:bg-red-600 hover:text-white text-white"
                  : "bg-gray-300 text-white cursor-not-allowed"
              } text-sm sm:text-base font-medium py-2 px-4 rounded-[3px] transition-colors duration-200 shadow-sm"
              ${!hasVacancies ? "disabled" : ""}
            >
              ${hasVacancies ? "Cadastrar" : "Indisponível"}
            </button>
          `;

        if (hasVacancies) {
          const button = jobCard.querySelector("button");
          button.addEventListener("click", () => {
            window.location.href = "cadastro.php";
          });
        }

        jobsGrid.appendChild(jobCard);
      });

      loadingJobs.classList.add("hidden");
      jobsList.classList.remove("hidden");
    } catch (error) {
      console.error("Error loading job openings:", error);
      loadingJobs.classList.add("hidden");
      jobError.classList.remove("hidden");
    }
  }

  if (cepData) {
    loadJobOpenings();
  }
});
