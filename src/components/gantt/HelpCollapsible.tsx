import { Button, buttonVariants } from "@/components/ui/button";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { Gitlab, IssueSchemaWithBasicLabels } from "@gitbeaker/rest";
import { clsx } from "clsx";
import { CheckCircle, CircleHelp, Copy } from "lucide-react";
import { useRef, useState } from "react";
import CreateIssueDialog from "./CreateIssueDialog";

const parameters = [
	{
		parameter: "start",
		type: "Date",
		required: "Yes",
		description: "Start date in YYYY-MM-DD format.",
	},
	{
		parameter: "progress",
		type: "Number",
		required: "No",
		description: "Progress as a percentage (0-100).",
	},
];

interface ToolsProps {
	gitlabInstance: InstanceType<typeof Gitlab>;
	selectedProjectId: string;
	issues: IssueSchemaWithBasicLabels[];
	setIssues: (issues: IssueSchemaWithBasicLabels[]) => void;
}

const Tools: React.FC<ToolsProps> = ({
	gitlabInstance,
	selectedProjectId,
	issues,
	setIssues,
}) => {
	const codeRef = useRef<HTMLPreElement>(null);
	const [copied, setCopied] = useState(false);
	const [isCreateIssueDialogOpen, setIsCreateIssueDialogOpen] = useState(false);

	const handleCopy = () => {
		if (codeRef.current) {
			const code = codeRef.current.innerText;
			navigator.clipboard.writeText(code).then(() => {
				setCopied(true);
				setTimeout(() => setCopied(false), 2000);
			});
		}
	};

	return (
		<Collapsible>
			<div className="flex gap-4 mb-2">
				<CollapsibleTrigger
					className={clsx(
						buttonVariants({ variant: "outline", size: "icon" }),
						"",
					)}
				>
					<CircleHelp className="h-4 w-4" />
				</CollapsibleTrigger>
				<CreateIssueDialog
					{...{
						isCreateIssueDialogOpen,
						setIsCreateIssueDialogOpen,
						gitlabInstance,
						selectedProjectId,
						issues,
						setIssues,
					}}
				/>
			</div>
			<CollapsibleContent className="border p-2 rounded-md md:max-w-3xl lg:max-w-5xl">
				<h2 className="text-xl font-bold mb-4">📝 Usage</h2>
				<p className="mb-4">
					To display GitLab issues as Gantt charts, include the following YAML
					as frontmatter at the top of the issue body:
				</p>
				<Table className="mb-4">
					<TableHeader>
						<TableRow>
							<TableHead>Parameter</TableHead>
							<TableHead>Type</TableHead>
							<TableHead>Required</TableHead>
							<TableHead>Description</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{parameters.map((row) => (
							<TableRow key={row.parameter}>
								<TableCell className=" font-medium">{row.parameter}</TableCell>
								<TableCell>{row.type}</TableCell>
								<TableCell>{row.required}</TableCell>
								<TableCell>{row.description}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
				<p>
					<strong>Note:</strong> Please set the <strong>due date</strong> in the
					issue's native field.
				</p>
				<h3 className="text-lg font-semibold mt-6">Example:</h3>
				<div className="relative">
					<pre
						ref={codeRef}
						className="bg-zinc-100 p-4 rounded overflow-x-auto"
					>
						<code>
							---
							{"\n"}start: 2024-08-05
							{"\n"}progress: 50
							{"\n"}---
						</code>
					</pre>
					<Button
						onClick={handleCopy}
						className="absolute top-2 right-2 flex items-center"
						variant="outline"
						size="sm"
					>
						{copied ? (
							<>
								<CheckCircle className="h-4 w-4 text-green-500 mr-1" />
								Copied!
							</>
						) : (
							<Copy className="h-4 w-4" />
						)}
					</Button>
				</div>
			</CollapsibleContent>
		</Collapsible>
	);
};

export default Tools;
