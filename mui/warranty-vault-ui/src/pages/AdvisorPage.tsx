import { useState, useEffect } from "react";
import PageHeader from "../components/PageHeader";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { API_BASE_URL, ENDPOINTS } from "../constants/apiConstants";
import axiosApi from "../config/axiosApiConfig";
import { useNavigate } from "react-router-dom";
import {
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Box,
  CircularProgress,
  Chip,
} from "@mui/material";
import { SmartToy, QuestionAnswer } from "@mui/icons-material";

interface Warranty {
  id: number;
  name: string;
  brand?: string;
  model?: string;
}

interface AdvisorCommonQuestionsResponse {
  q1: string;
  q2: string;
  q3: string;
}

function AdvisorPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [warranties, setWarranties] = useState<Warranty[]>([]);
  const [selectedWarranty, setSelectedWarranty] = useState<Warranty | null>(
    null
  );
  const [commonQuestions, setCommonQuestions] = useState<string[]>([]);
  const [customQuestion, setCustomQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingWarranties, setLoadingWarranties] = useState(true);

  // Fetch user's warranties on component mount
  useEffect(() => {
    fetchWarranties();
  }, []);

  // Fetch common questions when warranty is selected
  useEffect(() => {
    if (selectedWarranty) {
      fetchCommonQuestions(selectedWarranty.id);
    }
  }, [selectedWarranty]);

  const fetchWarranties = async () => {
    try {
      setLoadingWarranties(true);
      const response = await axiosApi.get(
        `${API_BASE_URL}${ENDPOINTS.GET_WARRANTIES.path}`
      );
      setWarranties(response.data || []);
    } catch (err: any) {
      toast.error(t("advisor.errors.fetchWarranties"));
      if (err.response?.status === 401) {
        navigate("/unauthorized");
      } else {
        navigate("/error");
      }
    } finally {
      setLoadingWarranties(false);
    }
  };

  const fetchCommonQuestions = async (warrantyId: number) => {
    try {
      setLoading(true);
      const url = ENDPOINTS.GET_ADVISOR_QUESTIONS.path.replace(
        "{warrantyId}",
        warrantyId.toString()
      );
      const response = await axiosApi({
        method: ENDPOINTS.GET_ADVISOR_QUESTIONS.method,
        url: `${API_BASE_URL}${url}`,
      });
      const data: AdvisorCommonQuestionsResponse = response.data;
      const questions = [data.q1, data.q2, data.q3].filter(
        (q) => q && q.trim() !== ""
      );
      setCommonQuestions(questions);
    } catch (err: any) {
      toast.error(t("advisor.errors.fetchQuestions"));
    } finally {
      setLoading(false);
    }
  };

  const askQuestion = async (question: string) => {
    if (!selectedWarranty || !question.trim()) {
      toast.error(t("advisor.errors.emptyQuestion"));
      return;
    }
    try {
      setLoading(true);
      setAnswer("");
      const url = ENDPOINTS.ADVISOR_ANSWER_QUESTION.path.replace(
        "{warrantyId}",
        selectedWarranty.id.toString()
      );
      const response = await axiosApi({
        method: ENDPOINTS.ADVISOR_ANSWER_QUESTION.method,
        url: `${API_BASE_URL}${url}`,
        params: { question },
      });
      // Handle JSON response with "answer" field
      const answerData = response.data;
      if (answerData && typeof answerData === "object" && answerData.answer) {
        setAnswer(answerData.answer);
      } else if (typeof answerData === "string") {
        setAnswer(answerData);
      } else {
        setAnswer("No answer received");
      }
    } catch (err: any) {
      toast.error(t("advisor.errors.getAnswer"));
    } finally {
      setLoading(false);
    }
  };

  const handleWarrantySelect = (warranty: Warranty) => {
    setSelectedWarranty(warranty);
    setAnswer("");
    setCustomQuestion("");
  };

  const handleQuestionClick = (question: string) => {
    askQuestion(question);
  };

  const handleCustomQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customQuestion.trim()) {
      askQuestion(customQuestion);
    }
  };

  if (loadingWarranties) {
    return (
      <>
        <PageHeader title={t("pages.advisor")} />
        <Paper
          elevation={3}
          sx={{
            borderRadius: 3,
            backgroundColor: "background.paper",
            p: 3,
            pt: 3,
            pb: 0,
            mt: 3,
            width: "90%",
            minHeight: "80vh",
            mx: "auto",
            display: "flex",
            flexDirection: "column",
            position: "relative",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress size={40} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            {t("common.loading")}
          </Typography>
        </Paper>
      </>
    );
  }

  return (
    <>
      <PageHeader title={t("pages.advisor")} />
      <Paper
        elevation={3}
        sx={{
          borderRadius: 3,
          backgroundColor: "background.paper",
          p: 3,
          pt: 3,
          pb: 0,
          mb: 3,
          mt: 3,
          width: "90%",
          minHeight: "80vh",
          mx: "auto",
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            pb: 3,
          }}
        >
          {/* Header Section */}
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 1,
              }}
            >
              <SmartToy sx={{ fontSize: 32, color: "primary.main", mr: 1 }} />
              <Typography variant="h4">{t("pages.advisor")}</Typography>
            </Box>
            <Typography variant="body1" color="text.secondary">
              {t("advisor.description")}
            </Typography>
          </Box>

          {/* Warranty Selection */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
              {t("advisor.selectWarranty")}
            </Typography>
            {warranties.length === 0 ? (
              <Paper sx={{ p: 3, textAlign: "center", bgcolor: "grey.50" }}>
                <Typography color="text.secondary">
                  {t("advisor.noWarranties")}
                </Typography>
              </Paper>
            ) : (
              <Grid container spacing={1.5}>
                {warranties.map((warranty) => (
                  <Grid item xs={12} sm={6} md={4} key={warranty.id}>
                    <Card
                      sx={{
                        cursor: "pointer",
                        transition: "all 0.2s",
                        border:
                          selectedWarranty?.id === warranty.id
                            ? "2px solid"
                            : "1px solid",
                        borderColor:
                          selectedWarranty?.id === warranty.id
                            ? "primary.main"
                            : "divider",
                        backgroundColor:
                          selectedWarranty?.id === warranty.id
                            ? "primary.light"
                            : "background.paper",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: 4,
                        },
                      }}
                      onClick={() => handleWarrantySelect(warranty)}
                    >
                      <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
                        <Typography
                          variant="body2"
                          gutterBottom
                          noWrap
                          sx={{ fontWeight: 500, fontSize: "0.85rem" }}
                        >
                          {warranty.name}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 0.3,
                            mt: 0.5,
                          }}
                        >
                          {warranty.brand && (
                            <Chip
                              label={warranty.brand}
                              size="small"
                              sx={{
                                fontSize: "0.6rem",
                                height: 16,
                                "& .MuiChip-label": {
                                  px: 0.5,
                                },
                              }}
                            />
                          )}
                          {warranty.model && (
                            <Chip
                              label={warranty.model}
                              size="small"
                              variant="outlined"
                              sx={{
                                fontSize: "0.6rem",
                                height: 16,
                                "& .MuiChip-label": {
                                  px: 0.5,
                                },
                              }}
                            />
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>

          {/* Questions Section */}
          {selectedWarranty && (
            <Box sx={{ mt: 1 }}>
              <Box sx={{ textAlign: "center", mb: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 1,
                  }}
                >
                  <QuestionAnswer
                    sx={{ fontSize: 28, color: "secondary.main", mr: 1 }}
                  />
                  <Typography variant="h5">
                    {t("advisor.questionsFor")} {selectedWarranty.name}
                  </Typography>
                </Box>
              </Box>

              {/* Common Questions */}
              {commonQuestions.length > 0 && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                    {t("advisor.commonQuestions")}
                  </Typography>
                  <Grid container spacing={2}>
                    {commonQuestions.map((question, index) => (
                      <Grid item xs={12} key={index}>
                        <Button
                          variant="outlined"
                          fullWidth
                          onClick={() => handleQuestionClick(question)}
                          disabled={loading}
                          sx={{
                            justifyContent: "flex-start",
                            textAlign: "left",
                            p: 2,
                            textTransform: "none",
                            "&:hover": {
                              backgroundColor: "action.hover",
                            },
                          }}
                        >
                          {question}
                        </Button>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

              {/* Custom Question */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                  {t("advisor.askCustomQuestion")}
                </Typography>
                <Box component="form" onSubmit={handleCustomQuestionSubmit}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    value={customQuestion}
                    onChange={(e) => setCustomQuestion(e.target.value)}
                    placeholder={t("advisor.questionPlaceholder")}
                    disabled={loading}
                    sx={{ mb: 2 }}
                    variant="outlined"
                  />
                  <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={!customQuestion.trim() || loading}
                      startIcon={loading ? null : <SmartToy />}
                      sx={{ minWidth: 140 }}
                    >
                      {loading ? t("common.loading") : t("advisor.askQuestion")}
                    </Button>
                  </Box>
                </Box>
              </Box>

              {/* Answer Display */}
              {answer && (
                <Paper
                  sx={{
                    p: 3,
                    mt: 3,
                    bgcolor: "background.default",
                    border: "1px solid",
                    borderColor: "primary.main",
                  }}
                >
                  <Typography variant="h6" gutterBottom color="primary">
                    {t("advisor.answer")}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      whiteSpace: "pre-wrap",
                      lineHeight: 1.6,
                      color: "text.primary",
                    }}
                  >
                    {answer}
                  </Typography>
                </Paper>
              )}

              {/* Loading State */}
              {loading && !answer && (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <CircularProgress size={40} />
                  <Typography
                    variant="h6"
                    sx={{ mt: 2 }}
                    color="text.secondary"
                  >
                    {t("advisor.gettingAnswer")}
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Paper>
    </>
  );
}

export default AdvisorPage;
