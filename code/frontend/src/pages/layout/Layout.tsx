import { Link } from "react-router-dom";
import styles from "./Layout.module.css";
import Azure from "../../assets/Azure.svg";
import KPW from "../../assets/kpw-logo.png";
import {
  LinkFilled,
  ShareRegular,
  ShieldLockRegular,
} from "@fluentui/react-icons";
import { BiUpload } from "react-icons/bi";
import { Dialog, Stack, TextField } from "@fluentui/react";
import { ReactNode, useEffect, useRef, useState } from "react";
import { HistoryButton } from "../../components/HistoryButton/HistoryButton";
import { getUserInfo } from "../../api";
import SpinnerComponent from '../../components/Spinner/Spinner';


export type LayoutProps = {
  children: ReactNode;
  toggleSpinner: boolean;
  onSetShowHistoryPanel: () => void;
  showHistoryBtn: boolean;
  showHistoryPanel: boolean;

};
const Layout = ({ children,toggleSpinner, ...props }: LayoutProps) => {
  const { showHistoryPanel, showHistoryBtn, onSetShowHistoryPanel } = props;
  const [isSharePanelOpen, setIsSharePanelOpen] = useState<boolean>(false);
  const [copyClicked, setCopyClicked] = useState<boolean>(false);
  const [copyText, setCopyText] = useState<string>("Copy URL");

  const handleShareClick = () => {
    setIsSharePanelOpen(true);
  };

  const handleSharePanelDismiss = () => {
    setIsSharePanelOpen(false);
    setCopyClicked(false);
    setCopyText("Copy URL");
  };

  const handleCopyClick = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopyClicked(true);
  };

  useEffect(() => {
    if (copyClicked) {
      setCopyText("Copied URL");
    }
  }, [copyClicked]);

  const [showAuthMessage, setShowAuthMessage] = useState<boolean | undefined>();
  const firstRender = useRef(true);

  const getUserInfoList = async () => {
    const userInfoList = await getUserInfo();
    if (
      userInfoList.length === 0 &&
      window.location.hostname !== "localhost" &&
      window.location.hostname !== "127.0.0.1"
    ) {
      setShowAuthMessage(true);
    } else {
      setShowAuthMessage(false);
    }
  };

  useEffect(() => {
    getUserInfoList();
  }, []);

  return (
    <div className={styles.layout}>
      <SpinnerComponent
        loading={toggleSpinner}
        label="Please wait.....!"
      />
      <header className={styles.header} role={"banner"}>
        <div className={styles.headerContainer}>
          <Stack horizontal verticalAlign="center">
            <img
              src={KPW}
              className={styles.headerIcon}
              aria-hidden="true"
              alt="KPW ASSISTANT"
            />
            <Link to="/" className={styles.headerTitleContainer}>
              <h3 className={styles.headerTitle}>KPW ASSISTANT</h3>
            </Link>
            <Stack horizontal className={styles.layoutRightButtons}>
              {!showAuthMessage && showHistoryBtn && (
                <HistoryButton
                  onClick={onSetShowHistoryPanel}
                  text={`${showHistoryPanel ? "Hide" : "Show"} Chat History`}
                />
              )}
              <div
                className={styles.shareButtonContainer}
                role="button"
                tabIndex={0}
                aria-label="Share"
                onClick={handleShareClick}
                onKeyDown={(e) =>
                  e.key === "Enter" || e.key === " " ? handleShareClick() : null
                }
              >
                <BiUpload className={styles.shareButton} />
                <span className={styles.shareButtonText}>Share</span>
              </div>
            </Stack>
          </Stack>
        </div>
      </header>
      {showAuthMessage ? (
        <Stack className={styles.chatEmptyState}>
          <ShieldLockRegular
            className={styles.chatIcon}
            style={{ color: "darkorange", height: "200px", width: "200px" }}
          />
          <h1 className={styles.chatEmptyStateTitle}>
            Authentication Not Configured
          </h1>
          <h2 className={styles.chatEmptyStateSubtitle}>
            This app does not have authentication configured. Please add an
            identity provider by finding your app in the{" "}
            <a href="https://portal.azure.com/" target="_blank">
              Azure Portal
            </a>{" "}
            and following{" "}
            <a
              href="https://learn.microsoft.com/en-us/azure/app-service/scenario-secure-app-authentication-app-service#3-configure-authentication-and-authorization"
              target="_blank"
            >
              these instructions
            </a>
            .
          </h2>
          <h2
            className={styles.chatEmptyStateSubtitle}
            style={{ fontSize: "20px" }}
          >
            <strong>
              Authentication configuration takes a few minutes to apply.{" "}
            </strong>
          </h2>
          <h2
            className={styles.chatEmptyStateSubtitle}
            style={{ fontSize: "20px" }}
          >
            <strong>
              If you deployed in the last 10 minutes, please wait and reload the
              page after 10 minutes.
            </strong>
          </h2>
        </Stack>
      ) : (
        <>{children}</>
      )}
      <Dialog
        onDismiss={handleSharePanelDismiss}
        hidden={!isSharePanelOpen}
        styles={{
          main: [
            {
              fontFamily: "Poppins",
              selectors: {
                ["@media (min-width: 480px)"]: {
                  fontFamily:"Poppins",
                  maxWidth: "400px",
                  background: "#FFFFFF",
                  boxShadow:
                    "0px 14px 28.8px rgba(0, 0, 0, 0.24), 0px 0px 8px rgba(0, 0, 0, 0.2)",
                  borderRadius: "15px",
                  maxHeight: "300px",
                  minHeight: "150px",
                },
              },
            },
          ],
        }}
        dialogContentProps={{
          title: "Share link to chat",
          subText:"Disclaimer: Content may be subject to change. Please don’t distribute externally.",
          showCloseButton: true,
          styles: {
            title: {
              fontFamily: "Poppins",
            },
            subText: {
              fontFamily: "Poppins",
            },
          },
        }}
      >
        <Stack horizontal verticalAlign="center"
        style={{ display:"flex",justifyContent:" space-between", border:"1px solid #bdbdbd", padding: "5px", borderRadius:"30px"}}>
          <TextField
            className={styles.urlTextBox}
            defaultValue={window.location.href}
            readOnly
            styles={{
              fieldGroup: {
                border: 'none',
                background: 'none',
              },
              field: {
                color: '#bdbdbd',
              },
            }}
          />
          <div
            className={styles.copyButtonContainer}
            role="button"
            tabIndex={0}
            aria-label="Copy"
            onClick={handleCopyClick}
            onKeyDown={(e) =>
              e.key === "Enter" || e.key === " " ? handleCopyClick() : null
            }
          >
            <LinkFilled className={styles.copyButton} />
            <span className={styles.copyButtonText}>{copyText}</span>
          </div>
        </Stack>
      </Dialog>
    </div>
  );
};

export default Layout;
