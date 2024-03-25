import {
  Table,
  UnstyledButton,
  Group,
  Text,
  Center,
  rem,
  Pagination,
  Paper,
  Box,
  LoadingOverlay,
  Badge,
  Tooltip,
  Space,
  ScrollArea,
  SimpleGrid,
  Code,
} from "@mantine/core";
import {
  IconSelector,
  IconChevronDown,
  IconChevronUp,
} from "@tabler/icons-react";
import { observer } from "mobx-react-lite";
import React from "react";

import { rootStore } from "../stores";

import classes from "./tablejobs.module.css";

interface IThProps {
  children: React.ReactNode;
  onSort(): void;
  name: string;
}

function Th({ children, onSort, name }: IThProps) {
  let Icon = IconSelector;
  if (rootStore.tableJobs.sort_by === name) {
    Icon =
      rootStore.tableJobs.sort_order === "asc"
        ? IconChevronUp
        : IconChevronDown;
  }
  return (
    <Table.Th className={classes.th}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group justify="space-between">
          <Text fw={500} fz="sm">
            {children}
          </Text>
          <Center className={classes.icon}>
            <Icon style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </Table.Th>
  );
}

function StatusControl(status: string, success: boolean) {
  let label = "";
  let color = "";
  let displayStatus = status;

  switch (status) {
    case "complete":
      label = success ? "Success" : "Failed";
      color = success ? "green" : "red";
      displayStatus = "complete";
      break;
    case "queued":
      label = "Queued";
      color = "gray";
      break;
    case "deferred":
      label = "Deferred";
      color = "gray";
      break;
    case "in_progress":
      label = "In Progress";
      color = "blue";
      break;
    default:
      label = "Unknown";
      color = "gray";
      break;
  }

  return (
    <Tooltip label={label} position="top" withArrow>
      <Badge color={color}>{displayStatus}</Badge>
    </Tooltip>
  );
}

export const TableJobs = observer(() => {
  const rows = rootStore.tableJobs.items.map((row) => (
    <React.Fragment key={row.id}>
      <Table.Tr
        key={row.id}
        className={classes.tr}
        onClick={() => rootStore.tableJobs.setToggleJob(row.id)}
      >
        <Table.Td className={classes.td}>{row.enqueue_time}</Table.Td>
        <Table.Td className={classes.td}>{row.id}</Table.Td>
        <Table.Td className={classes.td}>
          {StatusControl(row.status, row.success)}
        </Table.Td>
        <Table.Td className={classes.td}>{row.function}</Table.Td>
        <Table.Td className={classes.td}>{row.start_time}</Table.Td>
        <Table.Td className={classes.td}>{row.execution_duration}</Table.Td>
      </Table.Tr>
      <Table.Tr className={classes.expander_tr} key={`"${row.id}1`}>
        <Table.Td colSpan={6}>
          <div
            className={`${classes.expandedContent} ${
              rootStore.tableJobs.toggle_jobs.includes(row.id)
                ? classes.expandedContentshow
                : ""
            }`}
          >
            <Paper p="md">
              <SimpleGrid cols={2} spacing="xl">
                <Box>
                  <Table
                    horizontalSpacing="sm"
                    verticalSpacing="sm"
                    highlightOnHover
                    striped
                    styles={{}}
                  >
                    <Table.Tbody>
                      <Table.Tr
                        style={{ overflow: "hidden", textOverflow: "ellipsis" }}
                      >
                        <Table.Td>id</Table.Td>
                        <Table.Td
                          style={{
                            overflow: "hidden",
                          }}
                        >
                          {row.id}
                        </Table.Td>
                      </Table.Tr>
                      <Table.Tr>
                        <Table.Td>queue name</Table.Td>
                        <Table.Td>{row.queue_name}</Table.Td>
                      </Table.Tr>
                      <Table.Tr>
                        <Table.Td>function</Table.Td>
                        <Table.Td>{row.function}</Table.Td>
                      </Table.Tr>
                      <Table.Tr>
                        <Table.Td>status</Table.Td>
                        <Table.Td>{row.status}</Table.Td>
                      </Table.Tr>
                      <Table.Tr>
                        <Table.Td>job try</Table.Td>
                        <Table.Td>{row.job_try}</Table.Td>
                      </Table.Tr>
                      <Table.Tr>
                        <Table.Td>success</Table.Td>
                        <Table.Td>{String(row.success)}</Table.Td>
                      </Table.Tr>
                      <Table.Tr>
                        <Table.Td>enqueue time</Table.Td>
                        <Table.Td>{row.enqueue_time}</Table.Td>
                      </Table.Tr>
                      <Table.Tr>
                        <Table.Td>start time</Table.Td>
                        <Table.Td>{row.start_time}</Table.Td>
                      </Table.Tr>
                      <Table.Tr>
                        <Table.Td>finish time</Table.Td>
                        <Table.Td>{row.finish_time}</Table.Td>
                      </Table.Tr>
                      <Table.Tr>
                        <Table.Td>execution duration (sec)</Table.Td>
                        <Table.Td>{row.execution_duration}</Table.Td>
                      </Table.Tr>
                    </Table.Tbody>
                  </Table>
                </Box>
                <Box>
                  args:
                  <Code block mt={10} mah={200}>
                    {row.args}
                  </Code>
                  <br />
                  kwargs:
                  <Code block mt={10} mah={200}>
                    {(() => {
                      try {
                        return JSON.stringify(JSON.parse(row.kwargs), null, 2);
                      } catch (e) {
                        return row.kwargs;
                      }
                    })()}
                  </Code>
                  <br />
                  result:
                  <Code block mt={10} mah={500}>
                    {(() => {
                      try {
                        return JSON.stringify(JSON.parse(row.result), null, 2);
                      } catch (e) {
                        return row.result;
                      }
                    })()}
                  </Code>
                  <br />
                </Box>
              </SimpleGrid>
            </Paper>
          </div>
        </Table.Td>
      </Table.Tr>
    </React.Fragment>
  ));

  return (
    <>
      <ScrollArea>
        <Box pos="relative" miw={900}>
          <LoadingOverlay
            visible={rootStore.isLoading}
            zIndex={200}
            overlayProps={{ radius: "sm", blur: 1 }}
          />
          <Table
            striped
            highlightOnHover
            withTableBorder
            horizontalSpacing="md"
            verticalSpacing="lg"
            layout="fixed"
          >
            <Table.Tbody>
              <Table.Tr>
                <Th
                  onSort={() => rootStore.setSortBy("enqueue_time")}
                  key="enqueue_time"
                  name="enqueue_time"
                >
                  Enqueue time
                </Th>
                <Th onSort={() => rootStore.setSortBy("id")} key="id" name="id">
                  ID
                </Th>
                <Th
                  onSort={() => rootStore.setSortBy("status")}
                  key="status"
                  name="status"
                >
                  Status
                </Th>
                <Th
                  onSort={() => rootStore.setSortBy("function")}
                  key="functio"
                  name="function"
                >
                  Function
                </Th>
                <Th
                  onSort={() => rootStore.setSortBy("start_time")}
                  key="start_time"
                  name="start_time"
                >
                  Start Time
                </Th>
                <Th
                  onSort={() => rootStore.setSortBy("execution_duration")}
                  key="duration"
                  name="execution_duration"
                >
                  Duration
                </Th>
              </Table.Tr>
            </Table.Tbody>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </Box>
      </ScrollArea>
      <Space h="md" />
      <Center>
        <Pagination
          total={rootStore.totalPages}
          value={rootStore.currentPage}
          onChange={(value) => rootStore.setPage(value)}
          disabled={rootStore.isLoading}
        />
      </Center>
    </>
  );
});
