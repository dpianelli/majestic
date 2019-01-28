import React, { Suspense } from "react";
import styled from "styled-components";
import { Button } from "@smooth-ui/core-sc";
import SplitPane from "react-split-pane";
import { useQuery, useMutation } from "react-apollo-hooks";
import TestExplorer from "./tests-explorer";
import TestFile from "./test-file";
import APP from "./app.gql";
import useSubscription from "./test-file/use-subscription";
import SUMMARY_QUERY from "./summary-query.gql";
import SUMMARY_SUBS from "./summary-subscription.gql";
import RUN from "./run.gql";

const ContainerDiv = styled.div`
  display: flex;
  flex-direction: row;
`;

interface AppResult {
  app: { selectedFile: string };
}

export default function App() {
  const {
    data: {
      app: { selectedFile }
    },
    refetch
  } = useQuery<AppResult>(APP);

  const { data: summary } = useSubscription(
    SUMMARY_QUERY,
    SUMMARY_SUBS,
    {},
    result => result.summary,
    result => result.changeToSummary
  );

  const run = useMutation(RUN);

  return (
    <ContainerDiv>
      {/*  <Button
        size="sm"
        onClick={() => {
          run();
        }}
      >
        Run
      </Button> */}
      <SplitPane defaultSize={200} split="vertical">
        <TestExplorer
          selectedFile={selectedFile}
          onSelectedFileChange={refetch}
        />
        {selectedFile && <TestFile selectedFilePath={selectedFile} />}
      </SplitPane>
    </ContainerDiv>
  );
}